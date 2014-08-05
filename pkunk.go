package pkunk

import (
	"fmt"
	"github.com/robertkrimen/otto"
	"log"
	"net/http"
	"os"
)

type Env struct {
	//	RootHandler func(http.ResponseWriter, *http.Request)
	ServeMux *http.ServeMux

	Packs []*Pack

	CacheUrl  string
	CachePath string

	resourcePaths []string
}

type JsonHandlerFunc func(w http.ResponseWriter, r *http.Request)

//func (pk *Env) rootHandler(w http.ResponseWriter, r *http.Request) {
//	pk.bootstrap(w, r)
//}

func New(mux *http.ServeMux) *Env {
	pk := Env{
		ServeMux: mux,
	}

	//	pk.RootHandler = func(w http.ResponseWriter, r *http.Request) {
	//		pk.rootHandler(w, r)
	//	}

	return &pk
}

func (pk *Env) Cache(path string) {
	url := "/cache/"

	pk.CacheUrl = url
	pk.CachePath = path

	pk.ServeMux.Handle(url, http.StripPrefix(url, http.FileServer(http.Dir(path))))
}

func (pk *Env) Resources(resources ...string) {
	pk.resourcePaths = resources
}

func (pk *Env) ProcessPacks() {
	for _, pack := range pk.Packs {
		err := pack.Repack()
		if err != nil {
			panic(err)
		}
	}
}

func (pk *Env) JsonURL(url string, handler JsonHandlerFunc) {

	pk.ServeMux.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path)

		pk.ProcessPacks()

		html, err := pk.Prerender()
		if err != nil {
			if oe, ok := err.(*otto.Error); ok {
				fmt.Println(oe.String())
				os.Exit(0)
			}

			panic(err)
		}

		pk.Render(w, r, html)
	})
}
