package main

import (
	"container/list"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func main() {
	fmt.Println("Hello, world.")

	bus := &MessageBus{subscribers: list.New()}
	c := &ChatRoutes{messages: make(chan string, 100), bus: bus}

	mux := http.NewServeMux()
	mux.HandleFunc("/", c.index)
	mux.HandleFunc("/message", c.newMessage)

	err := http.ListenAndServe(":3001", mux)
	log.Fatal(err)
}

type ChatRoutes struct {
	messages chan string
	bus      *MessageBus
}

func (c *ChatRoutes) index(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	lat, err := strconv.ParseFloat(r.URL.Query().Get("lat"), 64)
	long, err2 := strconv.ParseFloat(r.URL.Query().Get("long"), 64)
	if err != nil || err2 != nil {
		return
	}
	messages := make(chan *Message)
	subscriber := MessageSubscriber{lat: lat, long: long, messages: messages}
	c.bus.subscribe(&subscriber)
	defer c.bus.unsubscribe(&subscriber)

	w.Header().Add("Content-Type", "text/event-stream")
	w.WriteHeader(200)

	for {
		select {
		case <-r.Context().Done():
			return
		case msg := <-messages:
			body, err := json.Marshal(msg)
			if err == nil {
				w.Write([]byte("data: "))
				w.Write([]byte(body))
				w.Write([]byte("\n\n"))
				if f, ok := w.(http.Flusher); ok {
					f.Flush()
				}
			}
		}
	}
}

func (c *ChatRoutes) newMessage(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	msg := query.Get("message")
	lat, err := strconv.ParseFloat(query.Get("lat"), 64)
	long, err2 := strconv.ParseFloat(query.Get("long"), 64)
	if len(msg) == 0 || err != nil || err2 != nil {
		return
	}
	if strings.Contains(msg, "\n") {
		return
	}
	go c.bus.sendMessage(&Message{AuthorName: query.Get("name"), Text: msg, lat: lat, long: long})
}
