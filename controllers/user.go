package controllers

import (
	"bitbucket.org/bluemirr/schedo/models"
	"encoding/json"
	"github.com/astaxie/beego"
)

type UserController struct {
	beego.Controller
}

// @router / [get]
func (this *UserController) Get() {
	//TODO
	bodyMap := make(map[string]interface{})
	bodyMap["userId"] = "id"
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router / [post]
func (this *UserController) Post() {
	var user models.User
	parseErr := json.Unmarshal(this.Ctx.Input.CopyBody(), &user)
	if parseErr != nil {
		this.Data["json"] = models.NewApiResult(400, parseErr, "bad request")
		this.ServeJson()
	}

	err := models.InsertUser(user)
	if err != nil {
		this.Data["json"] = models.NewApiResult(500, err, "not operated")
		this.ServeJson()
	}

	bodyMap := make(map[string]interface{})
	bodyMap["userId"] = "id"
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router / [put]
func (this *UserController) Put() {
	//TODO
	bodyMap := make(map[string]interface{})
	bodyMap["userId"] = "id"
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router /:id [delete]
func (this *UserController) Delete() {
	id := this.GetString(":id")
	models.DeleteUser(id)
	bodyMap := make(map[string]interface{})
	bodyMap["delete"] = "OK"
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}
