package vm

import (
	"fmt"
	"github.com/robertkrimen/otto"
	"log"
	"path/filepath"
)

type VM struct {
	Otto *otto.Otto

	requiring map[string]struct{}
	required  map[string]*otto.Value
	pathstack []string
}

func LogError(err error) bool {
	if err == nil {
		return false
	}

	if oe, ok := err.(*otto.Error); ok {
		log.Println("javascript error: ", oe.String())
		return true
	}

	log.Println(err)
	return true
}

func New() (*VM, error) {

	o := otto.New()

	o.Run(`
var process = {env:{}};
var prerender_path = "/";
`)

	vm := VM{
		Otto:      o,
		requiring: make(map[string]struct{}),
		required:  make(map[string]*otto.Value),
		pathstack: nil,
	}

	o.Set("require", func(call otto.FunctionCall) otto.Value {
		return vm.require(call)
	})

	return &vm, nil
}

func (vm *VM) RunFile(path string) error {
	path, err := filepath.Abs(path)
	if err != nil {
		return err
	}

	vm.requiring[path] = struct{}{}
	vm.pathstack = append(vm.pathstack, path)
	fmt.Println("compiling " + path + "...")

	s, err := vm.Otto.Compile(path, nil)
	if err != nil {
		return err
	}

	v, err := vm.Otto.Run(s)
	if err != nil {
		return err
	}

	fmt.Println("compilation done")
	str, err := v.ToString()
	if err != nil {
		fmt.Println("return value was not a string: [", v, "]")
	} else {
		fmt.Println("returned: [" + str + "]")
	}

	delete(vm.requiring, path)
	vm.pathstack = vm.pathstack[:len(vm.pathstack)-1]

	return nil
}
