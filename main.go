package main

import (
	_ "bitbucket.org/bluemirr/schedo/routers"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	beego.Run()
}

func init() {
	orm.RegisterDriver("mysql", orm.DR_MySQL)
	orm.RegisterDataBase("default", "mysql", "schedo:123434@tcp(bluemirr.kr:3306)/ScheDo?charset=utf8")
	orm.SetMaxOpenConns("default", 30)
}
