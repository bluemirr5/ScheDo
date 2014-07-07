package controllers

import (
	"bitbucket.org/bluemirr/schedo/models"
	"encoding/json"
	"github.com/astaxie/beego"
)

type ScheduleController struct {
	beego.Controller
}

func (c *ScheduleController) URLMapping() {
	c.Mapping("GetAll", c.GetAll)
	c.Mapping("Get", c.Get)
	c.Mapping("Post", c.Post)
	c.Mapping("Put", c.Put)
	c.Mapping("Delete", c.Delete)
}

// @router / [get]
func (this *ScheduleController) GetAll() {
	this.Data["json"] = models.SuccessResult(nil)
	this.ServeJson()
}

// @router /:id [get]
func (this *ScheduleController) Get() {
	this.Data["json"] = models.SuccessResult(nil)
	this.ServeJson()
}

// @router / [post]
func (this *ScheduleController) Post() {
	var schedule models.Schedule
	json.Unmarshal(this.Ctx.Input.CopyBody(), &schedule)
	models.InsertSchedule(schedule)

	this.Data["json"] = models.SuccessResult(nil)
	this.ServeJson()
}

// @router /:id [put]
func (this *ScheduleController) Put() {
	this.Data["json"] = models.SuccessResult(nil)
	this.ServeJson()
}

// @router /:id [delete]
func (this *ScheduleController) Delete() {
	this.Data["json"] = models.SuccessResult(nil)
	this.ServeJson()
}
