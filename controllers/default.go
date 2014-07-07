package controllers

import (
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
	this.TplNames = "index.html"
}
