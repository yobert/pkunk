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
	pk.Resources("./js/", "./css/", "../../js/")

	base, err := pk.NewPack("base",
		"bootstrap.js",
		"main.js",
		"home.js",
		"test.js",
		"layout.js",
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

	pk.BaseURL("/")

	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images/"))))
	singleFile("/robots.txt", "./robots.txt")
	singleFile("/favicon.ico", "./favicon.ico")

	fmt.Println("serving on :8080")
	fmt.Println(http.ListenAndServe(":8080", nil))
}
