package models

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	"image/png"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"code.gitea.io/gitea/modules/setting"
	"github.com/boltdb/bolt"
	"github.com/olahol/melody"
	ghfmd "github.com/shurcooL/github_flavored_markdown"
)

// ChatMessageForm is exported.
type ChatMessageForm struct {
	Unix            string `json:"unix"`
	UnixNano        string `json:"unixNano"`
	Message         string `json:"message"`
	RawMessage      string `json:"rawMessage"`
	IP              string `json:"ip"`
	Lat             string `json:"lat"`
	Lon             string `json:"lon"`
	City            string `json:"city"`
	Subdiv          string `json:"subdiv"`
	CountryIsoCode  string `json:"countryIsoCode"`
	Tz              string `json:"tz"`
	UserID          int    `json:"userId"`
	UserName        string `json:"userName"`
	IsQuery         bool   `json:"isQuery"`
	IsQueryResponse bool   `json:"queryResponse"`
	QueryResponseTo string `json:"queryResponseTo"`
}

// Drawing contains a JSONifies version of the canvas svg drawing and positioning and id/time data
type Drawing struct {
	AuthorID   string   `json:"authorId"`
	AuthorName string   `json:"authorName"`
	NewsID     string   `json:"nid"`
	CanvasData string   `json:"imageData"`
	Position   Position `json:"position"`
	Storepath  string   `json:"storePath"`
}

// Position is data for how to size and place the drawing relative to the news item
type Position struct {
	Width    int    `json:"width"`
	Height   int    `json:"height"`
	Top      int    `json:"top"`
	Left     int    `json:"left"`
	Position string `json:"position"`
	Display  string `json:"display"`
	ZIndex   int    `json:"zindex"`
}

// DrawingsQ is receiver when Frontend asks for ids:[id1, id2]
type DrawingsQ struct {
	IDs []string `json:"ids"`
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

// GopherInfo stores which gopher and in fo the money
type GopherInfo struct {
	ID    int         `json:"id"`
	Name  string      `json:"name"`
	Radio GopherRadio `json:"radio"`
}

// GopherRadio structures the radio data
type GopherRadio struct {
	Index int     `json:"index"`
	Seek  float64 `json:"seek"`
	Time  float64 `json:"time"`
	File  string  `json:"file"`
}

// var drawingStorePath = filepath.Join(setting.AppDataPath, "data", "drawing")
var drawingStorePath = filepath.Join(setting.AppDataPath, "public", "drawing")
var radioDJStorePath = filepath.Join(setting.AppDataPath, "data", "radio")

// Gophers stores GopherInfos by websocket session
var Gophers map[*melody.Session]*GopherInfo
var gopherCounter = 0

func init() {
	derr := os.MkdirAll(drawingStorePath, 0777)
	if derr != nil {
		fmt.Println("Error ensuring drawing store path. ", derr)
	}

	rerr := os.MkdirAll(radioDJStorePath, 0777)
	if rerr != nil {
		fmt.Println("Error ensuring radio store path.", rerr)
	}

	Gophers = make(map[*melody.Session]*GopherInfo)
}

// AddNewGopher regissters incoming gohpers
func AddNewGopher(s *melody.Session) *GopherInfo {
	var emptyRadio = GopherRadio{}
	Gophers[s] = &GopherInfo{gopherCounter, "", emptyRadio}
	gopherCounter++
	return Gophers[s]
}

// UpdateGopherName changes the gopher's name for the session.
// chat.js sends this on ws.connect
func UpdateGopherName(msg []byte, s *melody.Session) []byte {
	msgString := string(msg)
	name := strings.Replace(msgString, "iam:::", "", 1)
	Gophers[s].Name = name
	b, eb := json.Marshal(Gophers[s])
	if eb != nil {
		fmt.Println(eb)
	}

	prefix := "set:::"
	return []byte(prefix + string(b))
}

// SaveDJ store index, seek, and caller to a plain old text file
// Returns Gopher Session info (including current radio) or error
func SaveDJ(incoming []byte, s *melody.Session) ([]byte, error) {
	incomingS := string(incoming)
	in := strings.Replace(incomingS, "~~~", "", 1)

	var goRadio GopherRadio
	var e error
	e = json.Unmarshal([]byte(in), &goRadio)
	if e != nil {
		fmt.Println("Error unmarshalling radio info.", e)
		return nil, e
	}

	Gophers[s].Radio = goRadio

	gopherMarshal, e := json.Marshal(Gophers[s])
	if e != nil {
		fmt.Println("Error marshaling Gopher[s] info.", e)
		return nil, e
	}

	e = ioutil.WriteFile(filepath.Join(radioDJStorePath, "funk.txt"), gopherMarshal, 0664)
	if e != nil {
		fmt.Println("Error saving radio.", e)
	}

	return gopherMarshal, e

}

// GetDJ reads the save file and assembles a string for the websocket onconnect.
func GetDJ() ([]byte, error) {
	return ioutil.ReadFile(filepath.Join(radioDJStorePath, "funk.txt"))
}

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
				//but if no ids given, return em all
				if (len(ids) == 0) || (indexOf(ids, string(drawingkey)) > -1) {
					// if indexOf(ids, string(drawingkey)) > -1 {
					var drawing Drawing
					json.Unmarshal(drawingval, &drawing)
					drawing.CanvasData = "" // so send less data over da wires
					drawings = append(drawings, drawing)
				}
			}
		} else {
			//cuz its not an error if no drawings
			return nil
		}
		return err
	})
	return drawings, err
}

// PostDrawing saves a single drawing and if successful returns it
func PostDrawing(drawing Drawing) (Drawing, error) {
	var err error

	// TODO move saving base64 to png to own function
	// setting.AppDataPath
	// sec := settings.Cfg.Section("attachment")
	// var DrawingStorePath = setting.Cfg.Key("PATH").MustString(path.Join(setting.AppDataPath, "drawings"))
	// var drawingStorePath = path.Join(setting.AppDataPath, "drawing")
	// ^ moved to up top

	// decode ImageData -> PNG file in data/drawings/
	// err = os.MkdirAll(drawingStorePath, 0777)
	// if err != nil {
	// 	fmt.Println("ensuring drawing store dir exists", err)
	// 	return drawing, err
	// }

	prefix := "data:image/png;base64,"
	s := strings.TrimPrefix(drawing.CanvasData, prefix)

	imageReader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(s))
	pngImage, _, err := image.Decode(imageReader)
	if err != nil {
		fmt.Println("decoding image", err)
		return drawing, err
	}

	wo := filepath.Join(drawingStorePath, drawing.NewsID+".png")
	fmt.Println("saving drawing to: ", wo)
	imgFile, err := os.Create(wo)
	if err != nil {
		fmt.Println("creating drawing path", err)
		return drawing, err
	}
	defer imgFile.Close()

	err = png.Encode(imgFile, pngImage)
	if err != nil {
		fmt.Println("encoding drawing image", err)
		return drawing, err
	}

	// And i think this should overwrite existing drawings in case draw-delete-draw.

	// set new attribute Storepath, includes path /drawings/nid.png
	// or don't.. can just concat from front.

	drawingJSON, err := json.Marshal(drawing)
	// fmt.Println("model drawing", drawing)
	// fmt.Println("model jsoned drawingJSON string:", string(drawingJSON))
	fmt.Println("model drawing.NewsID string", string(drawing.NewsID))
	// This can go in a go routine --
	go func() {
		GetDB().Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte("drawings"))
			e := b.Put([]byte(drawing.NewsID), drawingJSON)
			if e != nil {
				fmt.Println("Didn't save post drawing in bolt.", e)
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

	fmt.Println("Drawing model to delete drawing with id ", did)
	if did == "" {
		return errors.New("Model didn't get an id to delete by.")
	}
	err = GetDB().Update(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("drawings"))

		c := b.Cursor()
		for drawingkey, _ := c.First(); drawingkey != nil; drawingkey, _ = c.Next() {
			fmt.Println("cursing through drawings", string(drawingkey))
			if did == string(drawingkey) {
				fmt.Println("got a match on id")
				err = b.Delete(drawingkey)
				if err != nil {
					fmt.Println("But could not delete", err)
					return err
				}
			}
		}
		return nil
	})
	if err != nil {
		fmt.Println("The error was with opening view to bdb", err)
	} else {
		wo := filepath.Join(drawingStorePath, did+".png")
		rmerr := os.Remove(wo)
		if rmerr != nil {
			fmt.Println("Removing drawing file err", rmerr)
		}

	}
	return err
}

// AllChatMsgs queries for all chat messages in bucket "chat."
func AllChatMsgs(withQueryResponses bool, limit int64) (ChatMessages, error) {

	var msgs ChatMessages
	var err error

	if limit == 0 {
		limit = 100
	}

	// GetDB() called directly because is in package in models/models.go
	err = GetDB().View(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("chat"))

		if b.Stats().KeyN > 0 {

			c := b.Cursor()
			for chatkey, chatval := c.First(); chatkey != nil; chatkey, chatval = c.Next() {
				var msg ChatMessageForm
				json.Unmarshal(chatval, &msg)
				if !withQueryResponses {
					if msg.IsQueryResponse {
						continue
					}
				}
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
	// TODO: Only iterate and collect the number we need, don't store and ALL messages everytime
	if len(msgs) > 100 {
		return msgs[len(msgs)-100:], err
	}
	return msgs, err
}

func ChatMsgSearch(ps1 []byte) (ChatMessageForm, error) {
	var p ChatMessageForm

	// 1502037081073740949 <- robotcat
	// 1502037081079600 <- js
	var msgs ChatMessages
	var out = ChatMessageForm{
		UserID:          9999,
		UserName:        "robotcat",
		Unix:            fmt.Sprintf("%d", time.Now().Unix()),
		UnixNano:        fmt.Sprintf("%16d", time.Now().UnixNano())[:16],
		Message:         "\n",
		IsQuery:         false,
		IsQueryResponse: true,
	}
	if e := json.Unmarshal(ps1, &p); e != nil {
		return out, e
	}
	// set reference id (for later lookup/get features)
	out.QueryResponseTo = p.UnixNano

	search := p.RawMessage
	search = strings.TrimSuffix(search, "\n")
	var err error

	err = GetDB().View(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("chat"))

		if b.Stats().KeyN > 0 {
			c := b.Cursor()
			for chatkey, chatval := c.First(); chatkey != nil; chatkey, chatval = c.Next() {
				var msg ChatMessageForm
				json.Unmarshal(chatval, &msg)
				// Don't collect queries or responses.
				if msg.IsQuery || msg.IsQueryResponse {
					continue
				}

				switch search[:1] {
				// begins with
				case "^":
					if strings.HasPrefix(msg.Message, search[1:]) || strings.HasPrefix(msg.RawMessage, search[1:]) {
						msgs = append(msgs, msg)
					}
					// ends with
				case "$":
					if strings.HasSuffix(msg.Message, search[1:]) || strings.HasSuffix(msg.RawMessage, search[1:]) {
						msgs = append(msgs, msg)
					}
					// contains
				case "%":
					if strings.Contains(msg.Message, search[1:]) || strings.Contains(msg.RawMessage, search[1:]) {
						msgs = append(msgs, msg)
					}
				default:
					err = errors.New("Not a search query.")
				}
			}
		} else {
			err = errors.New("No chat messages yet.") // return nil (no error, and msgs are gotten)
		}
		return err
	})
	if err != nil {
		return out, err
	}
	sort.Sort(msgs)

	if len(msgs) == 0 {
		out.Message += "No matching results."
		err = errors.New("No matching query results.")
		return out, err
	}

	for _, msg := range msgs {
		out.Message += fmt.Sprintf("- (%s) %s: %s\n", msg.Unix, msg.UserName, msg.Message)
	}

	return out, err

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

	// Save original plaintext message w/o formatting
	chatMessage.RawMessage = strings.TrimSuffix(chatMessage.Message, "\n")
	// Make markdowny
	chatMessage.Message = string(ghfmd.Markdown([]byte(chatMessage.Message)))

	// TODO: move this damn check to own func
	if strings.HasPrefix(chatMessage.RawMessage, "^") || strings.HasPrefix(chatMessage.RawMessage, "$") || strings.HasPrefix(chatMessage.RawMessage, "%") {
		chatMessage.IsQuery = true
	}

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
