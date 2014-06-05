package main

import (
	"github.com/yobert/pkunk"
	"net/http"
)

func singleFile(url string, path string) {
	http.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, path)
	})
}

func main() {
	pk := pkunk.New(http.DefaultServeMux)

	pk.Cache("./cache/")
	pk.Resources("./js/", "./css/", "../../js/")

	base, err := pk.NewPack("base", "pkunk/bootstrap.js", "home.js", "test.js")
	if err != nil {
		panic(err)
	}

	pk.Include(base)

	pk.JsonURL("/", nil)

	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images/"))))
	singleFile("/robots.txt", "./robots.txt")

	http.ListenAndServe(":8080", nil)
}
