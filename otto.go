package pkunk

import (
	"fmt"
	"github.com/robertkrimen/otto"
	"html/template"
	"os"
)

//var ottos map[string]*otto.Otto

//func init() {
//	ottos = make(map[string]*otto.Otto)
//}

func (pk *Env) TestOtto() {
	o, err := pk.GetOttoRuntime()
	if err != nil {
		if oe, ok := err.(*otto.Error); ok {
			fmt.Println(oe.String())
			os.Exit(0)
		}
		fmt.Println(err.Error())
		os.Exit(0)
	}
	_, err = o.Run("global.main_prerender();")
	if err != nil {
		if oe, ok := err.(*otto.Error); ok {
			fmt.Println(oe.String())
			os.Exit(0)
		}
		fmt.Println(err.Error())
		os.Exit(0)
	}
	fmt.Println("otto runtime ready")
}

func (pk *Env) GetOttoRuntime() (*otto.Otto, error) {
	//	key := ""
	//	for _, pack := range pk.Packs {
	//		if pack.Type != PACK_JS {
	//			continue
	//		}
	//
	//		key += "," + pack.PackedPath
	//	}

	//	o, ok := ottos[key]
	//	if ok {
	//		return o.Copy(), nil
	//	}

	o := otto.New()

	_, err := o.Run(`
var stuff = {};
var global = {};
`)

	if err != nil {
		return nil, err
	}

	for _, pack := range pk.Packs {
		if pack.Type != PACK_JS {
			continue
		}
		path := pack.PackedPath
		//path := "./js/server.js"
		fmt.Println("compiling " + path + "...")

		s, err := o.Compile(path, nil)
		if err != nil {
			return nil, err
		}

		_, err = o.Run(s)
		if err != nil {
			return nil, err
		}

		fmt.Println("compilation done")
	}

	//	ottos[key] = o
	//	return o.Copy(), nil
	return o, nil
}

func (pk *Env) Prerender() (template.HTML, error) {

	o, err := pk.GetOttoRuntime()
	if err != nil {
		return "", err
	}

	v, err := o.Run("stuff.main_prerender();")
	if err != nil {
		return "", err
	}

	str, err := v.ToString()
	if err != nil {
		return "", err
	}

	return template.HTML(str), nil
}

/*func otto_require_shim(call otto.FunctionCall) otto.Value {
    const requireHeader = `(function() {
    var module = { exports: {} };
    var exports = module.exports;`
    const requireFooter = `   return module.exports;
}());`
    path, err := call.Argument(0).ToString()
    if err != nil {
        return otto.UndefinedValue()
    }
    body, err := ioutil.ReadFile(path)
    if err != nil {
        return otto.UndefinedValue()
    }
    val, err := vm.Run(requireHeader + string(body) + requireFooter)
    if err != nil {
        return otto.UndefinedValue()
    }
    return val
}*/
