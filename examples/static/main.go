package main

import (
	"net/http"
	"github.com/yobert/pkunk"
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

	//http.HandleFunc("/", pk.RootHandler)

	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images/"))))
	singleFile("/robots.txt", "./robots.txt")

	http.ListenAndServe(":8080", nil)
}
