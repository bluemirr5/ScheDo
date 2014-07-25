package models

import (
	"github.com/astaxie/beego/orm"
)

type User struct {
	Id       string `orm:"pk" json:"id"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

func (this *User) TableName() string {
	return "USER"
}

func init() {
	orm.RegisterModel(new(User))
}

func InsertUser(user User) error {
	o := orm.NewOrm()
	_, err := o.Insert(&user)
	return err
}

func SelectUser(id string) (*User, error) {
	user := new(User)
	o := orm.NewOrm()
	err := o.QueryTable(user).Filter("id", id).One(user)
	return user, err
}

func DeleteUser(id string) (int64, error) {
	o := orm.NewOrm()
	rid, err := o.Delete(&User{Id: id})
	return rid, err
}
