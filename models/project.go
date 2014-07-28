package models

import (
	_ "encoding/json"
	"fmt"
	"github.com/astaxie/beego/orm"
	"time"
)

type Project struct {
	Id           int64  `json:"id"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	Status       string `json:"status"`
	RegisterDate int64
	ModifyDate   int64
}

type ProjectRelMember struct {
	Id             int64
	ProjectId      int64
	MemberId       string `json:"memberId"`
	MemberAuthType string `json:"memberAuthType"`
}

type ProjectParam struct {
	Project
	Members []ProjectRelMember `json:"members"`
}

func (this *Project) TableName() string {
	return "PROJECT"
}

func (this *Project) Insert() (int64, error) {
	o := orm.NewOrm()
	this.RegisterDate = time.Now().UnixNano()
	this.ModifyDate = this.RegisterDate
	return o.Insert(this)
}

func (this *ProjectRelMember) TableName() string {
	return "PROJECT_REL_MEMBER"
}

func (this *ProjectParam) InsertProject() error {
	var err error
	var projectId int64
	o := orm.NewOrm()
	err = o.Begin()

	projectId, err = this.Insert()

	members := this.Members

	memberCount := len(members)
	for i := 0; i < memberCount; i++ {
		member := members[i]
		member.ProjectId = projectId
		fmt.Println(member)
	}
	_, err = o.InsertMulti(memberCount, members)

	if err != nil {
		err = o.Rollback()
	} else {
		err = o.Commit()
	}
	return err
}

func init() {
	orm.RegisterModel(new(Project))
	orm.RegisterModel(new(ProjectRelMember))
}
