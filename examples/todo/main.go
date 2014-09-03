package main

import (
	"fmt"
	"github.com/yobert/pkunk"
	"net/http"
)

func main() {
	pk := pkunk.New(http.DefaultServeMux)

	pk.Cache("./cache/")
	pk.Resources("./js/", "./css/", "./cache/")

	jsbase, err := pk.NewPack("jsbase",
		"jsbase/ua.js",
		"jsbase/twig.js",
		"jsbase/tag.js",
		"jsbase/tools.js",
		"jsbase/ui.js",
		"jsbase/pubsub.js",
	)
	if err != nil {
		panic(err)
	}

	base, err := pk.NewPack("base",
		"client_packed.js",
	)
	if err != nil {
		panic(err)
	}

	css, err := pk.NewPack("base-css",
		"cssbase/ui.css",
		"screen.css",
	)
	if err != nil {
		panic(err)
	}

	pk.Include(jsbase)
	pk.Include(base)
	pk.Include(css)

	pk.BaseURL("/")

	pk.Static("/favicon.ico", "./favicon.ico")

	fmt.Println("serving on :8080")
	http.ListenAndServe(":8080", nil)
}
