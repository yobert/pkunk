package pkunk

import (
	"net/http"
	"log"
)

type Env struct {
	RootHandler func(http.ResponseWriter, *http.Request)
	ServeMux    *http.ServeMux

	Packs []*Pack

	CacheUrl  string
	CachePath string

	resourcePaths []string
}

type JsonHandlerFunc func(w http.ResponseWriter, r *http.Request)

func (pk *Env) rootHandler(w http.ResponseWriter, r *http.Request) {
	pk.bootstrap(w, r)
}

func New(mux *http.ServeMux) *Env {
	pk := Env{
		ServeMux: mux,
	}

	pk.RootHandler = func(w http.ResponseWriter, r *http.Request) {
		pk.rootHandler(w, r)
	}

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

func (pk *Env) JsonURL(url string, handler JsonHandlerFunc) {
	// ATM ignore handler
	pk.ServeMux.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path)
		pk.bootstrap(w, r)
	})
}
