package pkunk

/*
import (
	"fmt"
	"github.com/yobert/pkunk/vm"
	"html/template"
	"os"
)

func (pk *Env) TestOtto() {

	_, err := pk.Prerender()
	if vm.LogError(err) {
		os.Exit(1)
	}

	fmt.Println("otto runtime ready")
}

func (pk *Env) Prerender() (template.HTML, error) {
	v, err := vm.New()
	if err != nil {
		return "", err
	}

	err = v.RunFile("./js/server.js")
	if err != nil {
		return "", err
	}

	val, err := v.Otto.Run("prerender();")
	if err != nil {
		return "", err
	}

	str, err := val.ToString()
	if err != nil {
		return "", err
	}

	return template.HTML(str), nil
}*/
