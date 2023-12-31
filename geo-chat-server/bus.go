package main

import (
	"container/list"
	"log"
	"math"
	"sync"
)

type MessageSubscriber struct {
	lat      float64
	long     float64
	messages chan *Message
}

type MessageBus struct {
	subscribers *list.List
	mu          sync.RWMutex
}

type Message struct {
	AuthorName string
	Text       string
	lat        float64
	long       float64
}

func (m *MessageBus) sendMessage(message *Message) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	el := m.subscribers.Front()
	for el != nil {
		subscriber := el.Value.(*MessageSubscriber)
		dist := haversine(subscriber.lat, subscriber.long, message.lat, message.long)
		if dist < 1 {
			subscriber.messages <- message
		}
		el = el.Next()
	}
}

func (m *MessageBus) subscribe(subscriber *MessageSubscriber) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.subscribers.PushBack(subscriber)
	log.Println("added subscriber: ")
	log.Println(subscriber)
}

func (m *MessageBus) unsubscribe(subscriber *MessageSubscriber) {
	m.mu.Lock()
	defer m.mu.Unlock()
	el := m.subscribers.Front()
	for el != nil {
		if el.Value == subscriber {
			m.subscribers.Remove(el)
			log.Println("removed subscriber: ")
			log.Println(subscriber)
			return
		}
		el = el.Next()
	}
}

const earthRadiusKm = 6371.0

func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	// Convert latitude and longitude from degrees to radians
	lat1Rad := lat1 * math.Pi / 180.0
	lon1Rad := lon1 * math.Pi / 180.0
	lat2Rad := lat2 * math.Pi / 180.0
	lon2Rad := lon2 * math.Pi / 180.0

	// Haversine formula
	dlat := lat2Rad - lat1Rad
	dlon := lon2Rad - lon1Rad
	a := math.Pow(math.Sin(dlat/2), 2) + math.Cos(lat1Rad)*math.Cos(lat2Rad)*math.Pow(math.Sin(dlon/2), 2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	distance := earthRadiusKm * c

	return distance // in Km
}
