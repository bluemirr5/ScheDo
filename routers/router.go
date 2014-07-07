package routers

import (
	"bitbucket.org/bluemirr/schedo/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Include(&controllers.MainController{})
	//beego.Include(&controllers.ScheduleController{})

	ns := beego.NewNamespace("/api",
		beego.NSNamespace("/schedule",
			beego.NSInclude(
				&controllers.ScheduleController{},
			),
		),
		//beego.NSNamespace("/user",
		//	beego.NSInclude(
		//		&controllers.UserController{},
		//	),
		//),
	)
	beego.AddNamespace(ns)
}
