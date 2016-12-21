package models

import (
	"encoding/json"
	"fmt"
	"strconv"

	"errors"
	"sort"

	"github.com/boltdb/bolt"
	"github.com/olahol/melody"
	ghfmd "github.com/shurcooL/github_flavored_markdown"
)

// ChatMessageForm is exported.
type ChatMessageForm struct {
	Unix           string `json:"unix"`
	UnixNano       string `json:"unixNano"`
	Message        string `json:"message"`
	IP             string `json:"ip"`
	Lat            string `json:"lat"`
	Lon            string `json:"lon"`
	City           string `json:"city"`
	Subdiv         string `json:"subdiv"`
	CountryIsoCode string `json:"countryIsoCode"`
	Tz             string `json:"tz"`
	UserID         int    `json:"userId"`
	UserName       string `json:"userName"`
}

type ChatMessages []ChatMessageForm

// ChatMessage will implement all the methods required to satisfy
// the sort.Interface interface
func (slice ChatMessages) Len() int {
	return len(slice)
}
func (slice ChatMessages) Less(i, j int) bool {
	ii, _ := strconv.Atoi(slice[i].UnixNano)
	jj, _ := strconv.Atoi(slice[j].UnixNano)
	return ii < jj
}
func (slice ChatMessages) Swap(i, j int) {
	slice[i], slice[j] = slice[j], slice[i]
}

// AllChatMsgs queries for all chat messages in bucket "chat."
func AllChatMsgs() (ChatMessages, error) {

	var msgs ChatMessages
	var err error

	// GetDB() called directly because is in package in models/models.go
	err = GetDB().View(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("chat"))

		if b.Stats().KeyN > 0 {

			c := b.Cursor()
			for chatkey, chatval := c.First(); chatkey != nil; chatkey, chatval = c.Next() {
				var msg ChatMessageForm
				json.Unmarshal(chatval, &msg)
				msgs = append(msgs, msg)
			}
		} else {
			err = errors.New("No chat messages yet.") // return nil (no error, and msgs are gotten)
		}
		return err
	})
	sort.Sort(msgs)
	return msgs, err
}

// SaveChatMsg processes and formats incoming chat messages.
func SaveChatMsg(s *melody.Session, msg []byte) ([]byte, error) {

	fmt.Println("Saving chat message:")
	fmt.Println(string(msg))

	var chatMessage ChatMessageForm
	err := json.Unmarshal(msg, &chatMessage)
	if err != nil {
		fmt.Println(err)
	}

	// Make markdowny
	chatMessage.Message = string(ghfmd.Markdown([]byte(chatMessage.Message)))

	// Make JSONy for Melody to broadcast.
	chatMsgJSON, _ := json.Marshal(chatMessage)

	// This can go in a go routine --
	go func() {
		GetDB().Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte("chat"))
			e := b.Put([]byte(chatMessage.UnixNano), chatMsgJSON)
			if e != nil {
				fmt.Println(e)
				return e
			}
			return nil
		})
	}()

	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	fmt.Println("Returning markdowny chat message:")
	fmt.Println(string(chatMsgJSON))
	return chatMsgJSON, nil
}
