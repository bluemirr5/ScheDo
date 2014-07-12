package models

import (
	_ "encoding/json"
	"github.com/astaxie/beego/orm"
	"time"
)

type Schedule struct {
	Id           int64  `json:"id"`
	Text         string `json:"text"`
	StartDate    int64  `json:"start_date"`
	EndDate      int64  `json:"end_date"`
	Tag          string `json:"tag"`
	UserId       string `json:"userId"`
	StartMonth   string
	StartYear    int
	StartWeek    int
	RegisterDate int64
	ModifyDate   int64
	MultidayFlag string
}

func (this *Schedule) TableName() string {
	return "SCHEDULE"
}

func (this *Schedule) FillData() {
	startDateTime := time.Unix(0, this.StartDate*int64(time.Millisecond))
	this.StartMonth = startDateTime.Format("200601")
	year, week := startDateTime.ISOWeek()
	this.StartYear = year
	this.StartWeek = week
	if (this.EndDate - this.StartDate) >= int64(86400000) {
		this.MultidayFlag = "Y"
	}

	this.ModifyDate = time.Now().UnixNano()
}

func init() {
	orm.RegisterModel(new(Schedule))
}

func InsertSchedule(schedule Schedule) (int64, error) {
	o := orm.NewOrm()
	schedule.RegisterDate = time.Now().UnixNano()
	schedule.FillData()
	id, err := o.Insert(&schedule)
	return id, err
}

func SelectSchedule(userId, startMonth, endMonth string) ([]*Schedule, error) {
	var schedules []*Schedule
	o := orm.NewOrm()
	schedule := new(Schedule)
	_, err := o.QueryTable(schedule).Filter("userId", userId).Filter("startMonth__gte", startMonth).Filter("startMonth__lte", endMonth).All(&schedules)
	return schedules, err
}

func UpdateSchedule(schedule Schedule) (int64, error) {
	o := orm.NewOrm()
	pschedule := Schedule{Id: schedule.Id}
	err := o.Read(&pschedule)
	if err != nil {
		return -1, err
	}
	schedule.FillData()
	schedule.RegisterDate = pschedule.RegisterDate
	id, err := o.Update(&schedule)
	return id, err
}

func DeleteSchedule(id int64) (int64, error) {
	o := orm.NewOrm()
	rid, err := o.Delete(&Schedule{Id: id})
	return rid, err
}
