package models

import (
	_ "encoding/json"
	//"fmt"
	"github.com/astaxie/beego/orm"
	"time"
)

type Project struct {
	Id           int64  `json:"id"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	Status       string `json:"status"`
	AuthorId     string `json:"authorId"`
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

func (this *ProjectRelMember) TableName() string {
	return "PROJECT_REL_MEMBER"
}

func (this *Project) Insert() (int64, error) {
	o := orm.NewOrm()
	this.RegisterDate = time.Now().UnixNano()
	this.ModifyDate = this.RegisterDate
	return o.Insert(this)
}

func (this *Project) GetAll() ([]*Project, error) {
	var projects []*Project
	o := orm.NewOrm()
	_, err := o.QueryTable(this).Filter("authorId", this.AuthorId).All(&projects)
	return projects, err
}

func (this *ProjectParam) InsertProject() error {
	var err error

	o := orm.NewOrm()
	err = o.Begin()

	_, err = this.Insert()

	members := this.Members

	memberCount := len(members)
	var memberList []ProjectRelMember
	for i := 0; i < memberCount; i++ {
		member := members[i]
		member.ProjectId = this.Id
		memberList = append(memberList, member)
	}
	if memberCount > 0 {
		_, err = o.InsertMulti(memberCount, memberList)
	}

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
