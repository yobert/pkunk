package vm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/robertkrimen/otto"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// require in a node-ish way
// http://nodejs.org/docs/latest/api/modules.html

// sloppy exists() with sloppy error handling.
// returns true on purpose if there's a weird error
func exists(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	return true
}

func good_suffix(path string) bool {
	if strings.HasSuffix(path, ".js") ||
		strings.HasSuffix(path, ".jsx") ||
		strings.HasSuffix(path, ".json") {
		return true
	}
	return false
}

func (vm *VM) resolve(x string) (string, error) {
	y := filepath.Dir(vm.pathstack[len(vm.pathstack)-1])

	if strings.HasPrefix(x, "/") {
		return x, nil
	}

	if strings.HasPrefix(x, "./") ||
		strings.HasPrefix(x, "../") {

		x, err := filepath.Rel(y, y+"/"+x)
		if err != nil {
			return "", err
		}

		combo := y + "/" + x

		p, err := vm.resolve_as_file(combo)
		if err != nil {
			return "", err
		}
		if p != "" {
			return p, nil
		}
		p, err = vm.resolve_as_dir(combo)
		if err != nil {
			return "", err
		}
		if p != "" {
			return p, nil
		}

		return "", nil
	}

	return vm.resolve_node_modules(x, y)
}

func (vm *VM) resolve_as_file(x string) (string, error) {

	if good_suffix(x) {
		if exists(x) {
			return x, nil
		}
		return "", nil
	}

	if exists(x + ".js") {
		return x + ".js", nil
	}
	if exists(x + ".jsx") {
		return x + ".jsx", nil
	}
	if exists(x + ".json") {
		return x + ".json", nil
	}

	return "", nil
}

func (vm *VM) resolve_as_dir(x string) (string, error) {

	if exists(x + "/package.json") {
		var meta struct {
			Main string `json:"main"`
		}
		meta_js, err := ioutil.ReadFile(x + "/package.json")
		if err != nil {
			return "", err
		}
		err = json.Unmarshal(meta_js, &meta)
		if err != nil {
			return "", err
		}
		p, err := filepath.Abs(x + "/" + meta.Main)
		if err != nil {
			return "", err
		}
		// some modules apparently put a path without extension into main :(
		//return p, nil
		return vm.resolve_as_file(p)
	}

	return vm.resolve_as_file(x + "/index")
}

func (vm *VM) resolve_node_modules(x, y string) (string, error) {
	parts := strings.Split(y, "/")
	root := -1
	for i, p := range parts {
		if p == "node_modules" {
			root = i - 2
			break
		}
	}

	if root < -1 {
		root = -1
	}

	i := len(parts) - 1
	var dirs []string
	for i > root {
		if parts[i] != "node_modules" {
			dir := strings.Join(parts[0:i+1], "/") + "/node_modules"
			dirs = append(dirs, dir)
		}

		i--
	}

	for _, dir := range dirs {

		p, err := vm.resolve_as_file(dir + "/" + x)
		if err != nil {
			return "", err
		}
		if p != "" {
			return p, nil
		}
		p, err = vm.resolve_as_dir(dir + "/" + x)
		if err != nil {
			return "", err
		}
		if p != "" {
			return p, nil
		}
	}

	return "", nil
}

func (vm *VM) require(call otto.FunctionCall) otto.Value {
	var trace = vm.pathstack[len(vm.pathstack)-1] + ": "

	const requireHeader = `(function() {
	var module = { exports: {} };
	var exports = module.exports;`
	const requireFooter = `   return module.exports;
}());`
	path, err := call.Argument(0).ToString()
	if err != nil {
		fmt.Println(trace, "require() called without a string argument")
		return otto.UndefinedValue()
	}

	rpath, err := vm.resolve(path)
	if err != nil {
		fmt.Println(trace, "resolve error during require(", path, "): ", err)
		return otto.UndefinedValue()
	}

	if rpath == "" {
		fmt.Println(trace, "could not resolve path during require(", path, ")")
		return otto.UndefinedValue()
	}

	if old, ok := vm.required[rpath]; ok {
		return *old
	}

	if _, ok := vm.requiring[rpath]; ok {
		fmt.Println(trace, "double require(", path, ") for path: ", rpath)
		v := otto.UndefinedValue()
		vm.required[rpath] = &v
		return v
	}

	vm.requiring[rpath] = struct{}{}
	vm.pathstack = append(vm.pathstack, rpath)

	defer func() {
		vm.pathstack = vm.pathstack[:len(vm.pathstack)-1]
	}()
	defer delete(vm.requiring, rpath)

	var body []byte

	if strings.HasSuffix(rpath, ".jsx") {
		jsx := exec.Command("jsx-simple", rpath, "-")
		buf := bytes.NewBuffer(nil)
		jsx.Stdout = buf
		err := jsx.Run()
		if err != nil {
			fmt.Println(trace, "JSX transform during require(", path, ") with jsx-simple failed:", err)
			v := otto.UndefinedValue()
			vm.required[rpath] = &v
			return v
		}
		body = buf.Bytes()
	} else {

		body, err = ioutil.ReadFile(rpath)
		if err != nil {
			fmt.Println(trace, "ReadFile() error during require(", path, "):", err)
			v := otto.UndefinedValue()
			vm.required[rpath] = &v
			return v
		}
	}

	val, err := vm.Otto.Run(requireHeader + string(body) + requireFooter)
	if err != nil {
		fmt.Println(trace, "Run() error during require(", path, "):", err)
		v := otto.UndefinedValue()
		vm.required[rpath] = &v
		return v
	}

	vm.required[rpath] = &val
	return val
}
