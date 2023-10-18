package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Hello, world.")

	c := &ChatRoutes{messages: make(chan string, 100)}

	mux := http.NewServeMux()
	mux.HandleFunc("/", c.index)
	mux.HandleFunc("/message", c.newMessage)

	err := http.ListenAndServe(":3000", mux)
	log.Fatal(err)
}

type ChatRoutes struct {
	messages chan string
}

func (c *ChatRoutes) index(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	msg := <-c.messages
	w.Write([]byte(msg))
}

func (c *ChatRoutes) newMessage(w http.ResponseWriter, r *http.Request) {
	msg := r.URL.Query().Get("message")
	c.messages <- msg
}
