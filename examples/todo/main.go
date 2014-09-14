package main

import (
	"fmt"
	"github.com/yobert/pkunk"
	"github.com/yobert/undb"
	"net/http"
	"time"
)

func send_test(db *undb.Store, i int) {
	db.Lock()
	defer db.Unlock()

	t := db.Find("tododb.todos.2")
	if t != nil {
		t.Merge(map[string]interface{}{"Title": fmt.Sprintf("Item 2 gets thumped from the server (%d seconds)", i)}, "thumper")
	}

}

func main() {
	db := schema_init()

	go func() {
		i := 0
		for {
			time.Sleep(time.Second)
			i++
			send_test(db, i)
		}
	}()

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
	pk.Websocket("/ws", db.Websocket())

	pk.Static("/favicon.ico", "./favicon.ico")

	fmt.Println("serving on :8080")
	http.ListenAndServe(":8080", nil)
}
