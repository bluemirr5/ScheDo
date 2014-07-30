package controllers

import (
	"bitbucket.org/bluemirr/schedo/models"
	"encoding/json"
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) URLMapping() {
	c.Mapping("Main", c.Main)
	c.Mapping("Auth", c.Auth)
	c.Mapping("Logout", c.Logout)
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

// @router /auth [post]
func (this *MainController) Auth() {
	var user models.User
	parseErr := json.Unmarshal(this.Ctx.Input.CopyBody(), &user)
	if parseErr != nil {
		this.Data["json"] = models.NewApiResult(400, parseErr, "bad request")
		this.ServeJson()
	}

	selectedUser, err := models.SelectUser(user.Id)

	if err != nil || selectedUser.Password != user.Password {
		this.Data["json"] = models.NewApiResult(401, err, "not auth")
		this.ServeJson()
	} else {
		this.SetSession("user", selectedUser)
		this.Data["json"] = models.SuccessResult(selectedUser)
		this.ServeJson()
	}
}

// @router /logout [get]
func (this *MainController) Logout() {
	this.SetSession("user", nil)
	this.Redirect("/", 302)
}
