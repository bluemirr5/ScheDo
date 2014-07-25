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
	StartDay     string
	StartMonth   string
	StartYear    int
	StartWeek    int
	RegisterDate int64
	ModifyDate   int64
	MultidayFlag string
	Duration     int64
}

func (this *Schedule) TableName() string {
	return "SCHEDULE"
}

func (this *Schedule) fillSystemData() {
	startDateTime := time.Unix(0, this.StartDate*int64(time.Millisecond))
	this.StartMonth = startDateTime.Format("200601")
	this.StartDay = startDateTime.Format("20060102")
	year, week := startDateTime.ISOWeek()
	this.StartYear = year
	this.StartWeek = week
	this.Duration = this.EndDate - this.StartDate
	if (this.Duration) >= int64(86400000) {
		this.MultidayFlag = "Y"
	} else {
		this.MultidayFlag = "N"
	}
	this.ModifyDate = time.Now().UnixNano()
}

func init() {
	orm.RegisterModel(new(Schedule))
}

func InsertSchedule(schedule Schedule) (int64, error) {
	o := orm.NewOrm()
	schedule.RegisterDate = time.Now().UnixNano()
	schedule.fillSystemData()
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
	schedule.fillSystemData()
	schedule.RegisterDate = pschedule.RegisterDate
	id, err := o.Update(&schedule)
	return id, err
}

func DeleteSchedule(id int64) (int64, error) {
	o := orm.NewOrm()
	rid, err := o.Delete(&Schedule{Id: id})
	return rid, err
}

func SelectMonthStatistics(userId, month string) ([]orm.Params, error) {
	var maps []orm.Params
	o := orm.NewOrm()
	query := `
		SELECT 
			START_DAY as StartDay,
			TAG AS Tag, 
			SUM(DURATION) AS Duration
		FROM 
			SCHEDULE 
		WHERE
			USER_ID=?
			AND
			START_MONTH=?
		GROUP BY TAG, START_DAY
	`
	_, err := o.Raw(query, userId, month).Values(&maps)
	return maps, err
}
