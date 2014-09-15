package pkunk

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type AjaxJsonHandlerFunc func(*http.Request) interface{}

func (pk *Env) AjaxJson(url string, handler AjaxJsonHandlerFunc) {
	pk.ServeMux.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path)

		out := handler(r)

		// convert a standard error to a nice json {Error: } message
		e, eok := out.(error)
		if eok {
			out = struct{ Error string }{e.Error()}
		}

		outjson, err := json.Marshal(out)

		if err != nil {
			panic(err)
		}

		w.Header().Set("Content-Type", "application/json;charset=utf-8")
		w.Header().Set("Content-Length", strconv.Itoa(len(outjson)))
		w.WriteHeader(http.StatusOK)
		w.Write(outjson)
	})
}
