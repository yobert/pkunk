package main

import (
	"fmt"
	"github.com/gorilla/websocket"
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
		t.Merge(map[string]interface{}{"Title": fmt.Sprintf("(%d secs) Item 2 thump", i)}, "thumper")
	}

}

var db *undb.Store

func main() {
	db = schema_init()

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
	pk.Websocket("/ws", NewWebsocketSession)

	pk.Static("/favicon.ico", "./favicon.ico")

	fmt.Println("serving on :8080")
	http.ListenAndServe(":8080", nil)
}

type WebsocketSession struct {
}

var next_ws_id = 0

func (wsession *WebsocketSession) Authenticate(w http.ResponseWriter, r *http.Request) bool {
	return true
}

func (wsession *WebsocketSession) Handle(conn *websocket.Conn) {
	next_ws_id++
	ws_id := fmt.Sprintf("ws-%d", next_ws_id)

	db.Websocket(conn, ws_id)
}

func NewWebsocketSession() pkunk.WebsocketHandler {
	wsession := WebsocketSession{}
	return &wsession
}
