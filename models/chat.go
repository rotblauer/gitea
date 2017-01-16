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

// Drawing contains a JSONifies version of the canvas svg drawing and positioning and id/time data
type Drawing struct {
	AuthorID   string   `json:"authorId"`
	AuthorName string   `json:"authorName"`
	NewsID     string   `json:"nid"`
	CanvasData string   `json:"imageData"`
	Position   Position `json:"position"`
}

// Position is data for how to size and place the drawing relative to the news item
type Position struct {
	Width  int `json:"width"`
	Height int `json:"height"`
	Top    int `json:"top"`
	Left   int `json:"left"`
}

// ChatMessages is a bunch of chat messages. Stop bothering me.
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

//Drawings is plural
type Drawings []Drawing

func indexOf(sliceStrings []string, value string) int {
	for p, v := range sliceStrings {
		if v == value {
			return p
		}
	}
	return -1
}

//GetDrawings gets drawing for a given []strings of ids
func GetDrawings(ids []string) (Drawings, error) {
	var drawings Drawings
	var err error

	err = GetDB().View(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("drawings"))

		if b.Stats().KeyN > 0 {
			c := b.Cursor()
			for drawingkey, drawingval := c.First(); drawingkey != nil; drawingkey, drawingval = c.Next() {
				//only if drawing is in given drawings key set (we don't want all drawings just feeded times)
				if indexOf(ids, string(drawingkey)) > -1 {
					var drawing Drawing
					json.Unmarshal(drawingval, &drawing)
					drawings = append(drawings, drawing)
				}
			}
		} else {
			err = errors.New("No drawings yet.")
		}
		return err
	})
	return drawings, err
}

// PostDrawing saves a single drawing and if successful returns it
func PostDrawing(drawing Drawing) (Drawing, error) {
	var err error
	drawingJSON, err := json.Marshal(drawing)
	// This can go in a go routine --
	go func() {
		GetDB().Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte("drawings"))
			e := b.Put([]byte(drawing.NewsID), drawingJSON)
			if e != nil {
				fmt.Println(e)
				return e
			}
			return nil
		})
	}()

	if err != nil {
		fmt.Println(err)
		return drawing, err
	}
	return drawing, nil
}

//PatchDrawing updates a drawing
func PatchDrawing(drawing Drawing) (Drawing, error) {
	var err error

	err = GetDB().View(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("drawings"))

		c := b.Cursor()
		for drawingkey, _ := c.First(); drawingkey != nil; drawingkey, _ = c.Next() {
			if drawing.NewsID == string(drawingkey) {
				d, e := json.Marshal(drawing)
				if e != nil {
					return e
				}
				eb := b.Put(drawingkey, d)
				if eb != nil {
					return eb
				}
			}
		}
		return err
	})
	return drawing, err
}

//DeleteDrawing updates a drawing
func DeleteDrawing(did string) error {
	var err error

	err = GetDB().View(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("drawings"))

		c := b.Cursor()
		for drawingkey, _ := c.First(); drawingkey != nil; drawingkey, _ = c.Next() {
			if did == string(drawingkey) {
				eb := b.Delete(drawingkey)
				if eb != nil {
					return eb
				}
			}
		}
		return err
	})
	return err
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

	// Just last 100 if more than 100 msgs exist.
	// TODO: Paginate.
	if len(msgs) > 100 {
		return msgs[len(msgs)-100:], err
	}
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
