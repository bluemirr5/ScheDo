package controllers

import (
	"bitbucket.org/bluemirr/schedo/models"
	"encoding/json"
	"fmt"
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
	userId := this.GetString("userId")
	startMonth := this.GetString("startMonth")
	endMonth := this.GetString("endMonth")
	scheduleList, err := models.SelectSchedule(userId, startMonth, endMonth)
	if err != nil {
		this.Data["json"] = models.NewApiResult(404, err, "resource not exist")
		this.ServeJson()
	}
	for _, schedule := range scheduleList {
		fmt.Println(schedule)
	}
	bodyMap := make(map[string]interface{})
	bodyMap["scheduleList"] = scheduleList
	this.Data["json"] = models.SuccessResult(bodyMap)
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
