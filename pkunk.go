package pkunk

import (
	"net/http"
)

type PkunkEnv struct {
	RootHandler func(http.ResponseWriter, *http.Request)
	ServeMux *http.ServeMux

	CacheUrl string
	CachePath string

	resourcePaths []string
}

func (pk *PkunkEnv) rootHandler(w http.ResponseWriter, r *http.Request) {
	pk.bootstrap(w, r)
}

func New(mux *http.ServeMux) *PkunkEnv {
	pk := PkunkEnv{
		ServeMux: mux,
	}

	pk.RootHandler = func(w http.ResponseWriter, r *http.Request) {
		pk.rootHandler(w, r)
	}

	return &pk
}

func (pk *PkunkEnv) Cache(path string) {
	url := "/cache/"

	pk.CacheUrl = url
	pk.CachePath = path

	pk.ServeMux.Handle(url, http.StripPrefix(url, http.FileServer(http.Dir(path))))
}

func (pk *PkunkEnv) Resources(resources ...string) {
	pk.resourcePaths = resources
}

