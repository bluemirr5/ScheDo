package controllers

import (
	"bitbucket.org/bluemirr/schedo/models"
	"encoding/json"
	"github.com/astaxie/beego"
)

type ProjectController struct {
	beego.Controller
}

// @router / [get]
func (this *ProjectController) Get() {
	//TODO
	bodyMap := make(map[string]interface{})
	bodyMap["userId"] = "id"
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router / [post]
func (this *ProjectController) Post() {
	var project models.ProjectParam
	parseErr := json.Unmarshal(this.Ctx.Input.CopyBody(), &project)
	if parseErr != nil {
		this.Data["json"] = models.NewApiResult(400, parseErr, "bad request")
		this.ServeJson()
	}

	err := project.InsertProject()
	if err != nil {
		this.Data["json"] = models.NewApiResult(500, err, "not operated")
		this.ServeJson()
	}

	bodyMap := make(map[string]interface{})
	bodyMap["projectId"] = project.Id
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router / [put]
func (this *ProjectController) Put() {
	bodyMap := make(map[string]interface{})
	bodyMap["userId"] = "id"
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router / [delete]
func (this *ProjectController) Delete() {
	bodyMap := make(map[string]interface{})
	bodyMap["userId"] = "id"
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}
