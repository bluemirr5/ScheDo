package models

import (
	_ "encoding/json"
	"fmt"
	"github.com/astaxie/beego/orm"
	"time"
)

type Schedule struct {
	Id              int64     `json:"id"`
	Text            string    `json:"text"`
	StartDate       time.Time `json:"start_date"`
	EndDate         time.Time `json:"end_date"`
	StartDateString string    `json:"startDateString"`
	Tag             string    `json:"tag"`
	UserId          string    `json:"userId"`
	RegisterDate    int64
	ModifyDate      int64
}

func (this *Schedule) TableName() string {
	return "SCHEDULE"
}

func init() {
	orm.RegisterModel(new(Schedule))
}

func InsertSchedule(schedule Schedule) (int64, error) {
	fmt.Println(schedule)
	o := orm.NewOrm()
	schedule.RegisterDate = time.Now().UnixNano()
	schedule.ModifyDate = time.Now().UnixNano()
	id, err := o.Insert(&schedule)
	return id, err
}

func SelectSchedule(userId, startMonth, endMonth string) ([]*Schedule, error) {
	var schedules []*Schedule
	o := orm.NewOrm()
	_, err := o.Raw("SELECT id,text,start_date,end_date,start_date_string,tag,user_id,register_date,modify_date FROM SCHEDULE WHERE USER_ID=? AND START_DATE_STRING >= ? AND START_DATE_STRING <= ?", userId, startMonth, endMonth).QueryRows(&schedules)
	return schedules, err
}
