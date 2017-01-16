package chat

import (
	// "github.com/gogits/gogs/modules/base"
	// "github.com/gogits/gogs/models"
	// "github.com/gogits/gogs/modules/context"
	"code.gitea.io/gitea/models"
	"code.gitea.io/gitea/modules/context"
	"fmt"
	"strings"
)

// const (
// 	HOME base.TplName = "home"
// 	// EXPLORE_REPOS base.TplName = "explore/repos"
// 	// EXPLORE_USERS base.TplName = "explore/users"
// 	TEST_PAGE base.TplName = "chat/test"
// )

// GetChatData is called by AJAX on /chat HTML inline JS page load.
func GetChatData(c *context.Context) {
	msgs, err := models.AllChatMsgs() // msgs are type []ChatMessageForm
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, msgs)
	}
}

//GetDrawings gets drawings given a set of ids
func GetDrawings(c *context.Context) {
	ids := c.Query("nids") //news ids in UTC separated by ;
	splitIds := strings.Split(ids, ";")
	drawings, err := models.GetDrawings(splitIds)
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, drawings)
	}
}

//PostDrawing saves a single drawing
func PostDrawing(c *context.Context, drawing models.Drawing) {
	d, err := models.PostDrawing(drawing)
	fmt.Println("priting line")
	fmt.Println(d, err)
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
	did := c.Params("id")
	err := models.DeleteDrawing(did)
	if err != nil {
		c.JSON(500, err.Error())
	} else {
		c.JSON(200, "OK")
	}
}
