package main

import (
	"fmt"
	"github.com/yobert/pkunk"
	"log"
	"net/http"
)

func main() {
	pk := pkunk.New(http.DefaultServeMux)

	pk.Cache("./cache/")
	pk.Resources("./js/", "./css/", "./cache/")

	base, err := pk.NewPack("base",
		"client_packed.js",
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

	fmt.Println("serving on :8080")
	log.Println(http.ListenAndServe(":8080", nil))
}
