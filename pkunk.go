package pkunk

import (
	//	"fmt"
	//	"github.com/robertkrimen/otto"
	"log"
	"net/http"
	//	"os"
	"strings"

	"html/template"
)

type Env struct {
	//	RootHandler func(http.ResponseWriter, *http.Request)
	ServeMux *http.ServeMux

	Packs []*Pack
	DontRepack bool

	CacheUrl  string
	CachePath string

	resourcePaths []string

	// hack for the moment to stick some stuff in the head section
	Head template.HTML
	Body template.HTML
}

type HandlerFunc func(http.ResponseWriter, *http.Request)

//type JsonHandlerFunc func(w http.ResponseWriter, r *http.Request)

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

func (pk *Env) Static(pattern string, path string) {
	if strings.HasSuffix(pattern, "/") {
		pk.ServeMux.Handle(pattern, http.StripPrefix(pattern, http.FileServer(http.Dir(path))))
	} else {
		pk.ServeMux.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, path)
		})
	}
}

func (pk *Env) Cache(path string) {
	url := "/cache/"

	pk.CacheUrl = url
	pk.CachePath = path

	pk.Static(url, path)
}

func (pk *Env) Resources(resources ...string) {
	pk.resourcePaths = resources
}

func (pk *Env) ProcessPacks() {
	for _, pack := range pk.Packs {
		if pk.DontRepack && pack.PackedPath != "" {
			continue
		}
		err := pack.Repack()
		if err != nil {
			panic(err)
		}
	}
}

func (pk *Env) BaseURL(url string) { //, handler JsonHandlerFunc) {

	pk.ServeMux.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path)

		// for now, always re-analyze to see if the contents of the javscript
		// changed and need to be repacked
		pk.ProcessPacks()

		/*html, err := pk.Prerender()
		if err != nil {
			if oe, ok := err.(*otto.Error); ok {
				fmt.Println(oe.String())
				os.Exit(0)
			}

			panic(err)
		}
		pk.Render(w, r, html)*/

		pk.Render(w, r, "")
	})
}
