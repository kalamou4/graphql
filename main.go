package main

import (
	src "graphql/backend/src"
	"log"
	"net/http"
)

func main() {

	http.Handle("/frontEnd/", http.StripPrefix("/frontEnd/", http.FileServer(http.Dir("frontEnd"))))
	http.HandleFunc("/", src.Render)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
