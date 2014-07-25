package controllers

import (
	"bitbucket.org/bluemirr/schedo/models"
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) URLMapping() {
	c.Mapping("Main", c.Main)
}

// @router / [get]
func (this *MainController) Main() {
	v := this.GetSession("user")
	if v != nil {
		user := v.(*models.User)
		this.Data["userId"] = user.Id
		this.Data["userName"] = user.Name
		this.TplNames = "index.html"
	} else {
		this.TplNames = "login.html"
	}
}
