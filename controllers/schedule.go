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

	bodyMap := make(map[string]interface{})
	bodyMap["scheduleList"] = scheduleList
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router /:id [get]
func (this *ScheduleController) Get() {
	var schedule models.Schedule
	json.Unmarshal(this.Ctx.Input.CopyBody(), &schedule)

	this.Data["json"] = models.SuccessResult(nil)
	this.ServeJson()
}

// @router / [post]
func (this *ScheduleController) Post() {
	var schedule models.Schedule
	json.Unmarshal(this.Ctx.Input.CopyBody(), &schedule)

	id, err := models.InsertSchedule(schedule)
	if err != nil {
		this.Data["json"] = models.NewApiResult(500, err, "not operated")
		this.ServeJson()
	}
	bodyMap := make(map[string]interface{})
	bodyMap["scheduleId"] = id

	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router /:id [put]
func (this *ScheduleController) Put() {
	id, _ := this.GetInt(":id")
	var schedule models.Schedule
	json.Unmarshal(this.Ctx.Input.CopyBody(), &schedule)
	schedule.Id = id

	pid, _ := models.UpdateSchedule(schedule)
	bodyMap := make(map[string]interface{})
	bodyMap["scheduleId"] = pid

	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}

// @router /:id [delete]
func (this *ScheduleController) Delete() {
	id, _ := this.GetInt(":id")
	pid, _ := models.DeleteSchedule(id)

	bodyMap := make(map[string]interface{})
	bodyMap["scheduleId"] = pid

	this.Data["json"] = models.SuccessResult(nil)
	this.ServeJson()
}

// @router /month [get]
func (this *ScheduleController) SelectMonthStatistics() {
	userId := this.GetString("userId")
	month := this.GetString("month")

	statisticsList, err := models.SelectMonthStatistics(userId, month)

	if err != nil {
		fmt.Println(err)
		this.Data["json"] = models.NewApiResult(404, err, "resource not exist")
		this.ServeJson()
	}

	bodyMap := make(map[string]interface{})
	bodyMap["statisticsList"] = statisticsList
	this.Data["json"] = models.SuccessResult(bodyMap)
	this.ServeJson()
}
