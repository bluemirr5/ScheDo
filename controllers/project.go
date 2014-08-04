package controllers

import (
	"bitbucket.org/bluemirr/schedo/models"
	"encoding/json"
	//"fmt"
	"github.com/astaxie/beego"
)

type ProjectController struct {
	beego.Controller
}

// @router /all [get]
func (this *ProjectController) GetAll() {
	v := this.GetSession("user")
	userInfo := v.(*models.User)

	project := new(models.Project)
	project.AuthorId = userInfo.Id

	projects, err := project.GetAll()
	if err != nil {
		this.Data["json"] = models.NewApiResult(500, err, "not operated")
		this.ServeJson()
	}

	bodyMap := make(map[string]interface{})
	bodyMap["projectList"] = projects
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
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
	var project models.ProjectParam
	parseErr := json.Unmarshal(this.Ctx.Input.CopyBody(), &project)
	if parseErr != nil {
		this.Data["json"] = models.NewApiResult(400, parseErr, "bad request")
		this.ServeJson()
	}

	err := project.Update()
	if err != nil {
		this.Data["json"] = models.NewApiResult(500, err, "not operated")
		this.ServeJson()
	}

	bodyMap := make(map[string]interface{})
	bodyMap["projectId"] = project.Id
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router /:id [delete]
func (this *ProjectController) Delete() {
	id, _ := this.GetInt(":id")
	project := new(models.Project)
	project.Id = id
	err := project.Delete()
	if err != nil {
		this.Data["json"] = models.NewApiResult(500, err, "not operated")
		this.ServeJson()
	}
	bodyMap := make(map[string]interface{})
	bodyMap["userId"] = project.Id
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}
