package routers

import (
	"bitbucket.org/bluemirr/schedo/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Include(&controllers.MainController{})

	ns := beego.NewNamespace("/api",
		beego.NSNamespace("/user",
			beego.NSInclude(
				&controllers.UserController{},
			),
		),
		beego.NSNamespace("/schedule",
			beego.NSInclude(
				&controllers.ScheduleController{},
			),
		),
		beego.NSNamespace("/project",
			beego.NSInclude(
				&controllers.ProjectController{},
			),
		),
	)
	beego.AddNamespace(ns)
}
