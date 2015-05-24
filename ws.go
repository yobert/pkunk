package pkunk

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"time"
)

var ws_upgrader = websocket.Upgrader{
	ReadBufferSize:  8192,
	WriteBufferSize: 8192,
}

type WebsocketHandler interface {
	Authenticate(http.ResponseWriter, *http.Request) bool
	Handle(*websocket.Conn)
	Pong()
}

func (pk *Env) Websocket(url string, handlerbuilder func() WebsocketHandler, ping, slop time.Duration) {
	pk.ServeMux.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Method not allowed", 405)
			return
		}

		if r.Header.Get("Origin") != "http://"+r.Host { // TODO check for https
			http.Error(w, "Origin not allowed", 403)
			return
		}

		handler := handlerbuilder()
		success := handler.Authenticate(w, r)

		if !success {
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

		defer ws.Close()

		if ping != 0 {
			err = ws.SetReadDeadline(time.Now().Add(ping + slop))
			if err != nil {
				log.Println(err)
				return
			}

			go func() {
				c := time.Tick(ping)
				for _ = range c {
					if err := ws.WriteControl(websocket.PingMessage, nil, time.Now().Add(slop)); err != nil {
						log.Println(err)
						ws.Close()
						break
					}
				}
			}()

			ws.SetPongHandler(func(string) error {
				handler.Pong()
				return ws.SetReadDeadline(time.Now().Add(ping + slop))
			})
		}

		handler.Handle(ws)
	})
}
