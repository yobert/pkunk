package pkunk

import (
	"github.com/gorilla/websocket"
	"net/http"
)

var ws_upgrader = websocket.Upgrader{
	ReadBufferSize:  8192,
	WriteBufferSize: 8192,
}

type WebsocketHandlerFunc func(*websocket.Conn)

func (pk *Env) Websocket(url string, handler WebsocketHandlerFunc) {
	pk.ServeMux.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {

		if r.Method != "GET" {
			http.Error(w, "Method not allowed", 405)
			return
		}

		if r.Header.Get("Origin") != "http://"+r.Host { // TODO check for https
			http.Error(w, "Origin not allowed", 403)
			return
		}

		ws, err := ws_upgrader.Upgrade(w, r, nil)
		if _, ok := err.(websocket.HandshakeError); ok {
			http.Error(w, "Not a websocket handshake", 400)
			return
		} else if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		handler(ws)
	})
}
