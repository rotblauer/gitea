package chat

import (
	// "github.com/gogits/gogs/modules/base"
	// "github.com/gogits/gogs/models"
	// "github.com/gogits/gogs/modules/context"
	"code.gitea.io/gitea/models"
	"code.gitea.io/gitea/modules/context"
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
