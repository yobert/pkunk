package main

import (
	"fmt"
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
	pk.Resources("./js/", "./css/")

	base, err := pk.NewPack("base",
		"client.js",
	)
	if err != nil {
		panic(err)
	}

	css, err := pk.NewPack("base-css",
		"screen.css",
	)
	if err != nil {
		panic(err)
	}

	pk.Include(base)
	pk.Include(css)

	pk.JsonURL("/", nil)

	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images/"))))
	singleFile("/favicon.ico", "./favicon.ico")

	pk.TestOtto()

	fmt.Println("serving on :8080")
	http.ListenAndServe(":8080", nil)
}
