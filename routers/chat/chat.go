package chat

import (
	// "github.com/gogits/gogs/modules/base"
	// "github.com/gogits/gogs/models"
	// "github.com/gogits/gogs/modules/context"
	"code.gitea.io/gitea/models"
	"code.gitea.io/gitea/modules/context"
	// "fmt"
	"log"
)

// const (
// 	HOME base.TplName = "home"
// 	// EXPLORE_REPOS base.TplName = "explore/repos"
// 	// EXPLORE_USERS base.TplName = "explore/users"
// 	TEST_PAGE base.TplName = "chat/test"
// )

func fuzzyQueriesString(c *context.Context, options []string) (matchedQuery string) {
	for _, o := range options {
		if q := c.Query(o); q != "" {
			matchedQuery = q
		}
	}
	return matchedQuery
}
func fuzzyQueriesInt(c *context.Context, options []string) (matchedQuery int) {
	for _, o := range options {
		if q := c.QueryInt(o); q != 0 {
			matchedQuery = q
		}
	}
	return matchedQuery
}
func fuzzyQueriesBool(c *context.Context, options []string) (matchedQuery bool) {
	for _, o := range options {
		if q := c.QueryBool(o); q != false {
			matchedQuery = q
		}
	}
	return matchedQuery
}

// GetChatData is called by AJAX on /chat HTML inline JS page load.
func GetChatData(c *context.Context) {
	wantQRs := fuzzyQueriesBool(c, []string{"qs", "q", "qr", "qrs", "queries"})
	limit := fuzzyQueriesInt(c, []string{"limit", "l", "lim", "number", "count"})
	if limit == 0 {
		limit = 100
	}
	username := fuzzyQueriesString(c, []string{"username", "user", "u", "name"})
	regx := fuzzyQueriesString(c, []string{"regex", "r", "reg", "regx", "re"})

	msgs, err := models.AllChatMsgs(wantQRs, limit, username, regx) // msgs are type []ChatMessageForm
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, msgs)
	}
}

//GetDrawings gets drawings given a set of ids []string
func GetDrawings(c *context.Context, q models.DrawingsQ) {
	log.Println("getting drawings for ids: ", q.IDs)
	drawings, err := models.GetDrawings(q.IDs)
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, drawings)
	}
}

//PostDrawing saves a single drawing
func PostDrawing(c *context.Context, drawing models.Drawing) {

	// log.Println("router post drawing", drawing)
	log.Println("router post drawing.NewsID", drawing.NewsID)

	d, err := models.PostDrawing(drawing)
	// log.Println("priting line")
	// log.Println(d, err)
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, d)
	}

}

//PatchDrawing updates a drawing
func PatchDrawing(c *context.Context, drawing models.Drawing) {
	d, err := models.PatchDrawing(drawing)
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, d)
	}
}

//DeleteDrawing updates a drawing
func DeleteDrawing(c *context.Context) {
	did := c.Params(":id")
	log.Println("deleting with id", did)
	if did == "" {
		c.JSON(500, "Didn't get the id right. Params faults.")
	}
	err := models.DeleteDrawing(did)
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, "OK")
	}
}
