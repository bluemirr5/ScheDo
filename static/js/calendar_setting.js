var html = function(id) { return document.getElementById(id); }; //just a helper

function save_form() {
	var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
	ev.text = html("text").value;
	ev.projectId = Number(html("projectId").value);
	scheduler.endLightbox(true, html("my_form"));
}
function close_form() {
	scheduler.endLightbox(false, html("my_form"));
}
function delete_event() {
	var event_id = scheduler.getState().lightbox_id;
	scheduler.endLightbox(false, html("my_form"));
	scheduler.deleteEvent(event_id);
}

scheduler.config.time_step = 30;
scheduler.config.details_on_create = true;
scheduler.config.details_on_dblclick = true;
scheduler.config.start_on_monday = false;
scheduler.config.month_date = "%Y.%m";
scheduler.config.default_date = "%m.%d";
scheduler.config.day_date = "%D, %m.%d";
scheduler.config.max_month_events = 3;
scheduler.config.multi_day = false;

scheduler.xy.min_event_height = 21;



scheduler.templates.event_class = function(start, end, event) {
	  return "my_event";
};

function convertEventToServer(e, id) {
	var obj = {};
	if(id){
		obj.id = id;
	}
	obj.projectId = e.projectId;
	obj.text = e.text;
	obj.userId = scheduler.userId;
	obj.start_date = e.start_date.getTime();
	obj.end_date = e.end_date.getTime();
	//obj.startDateString = e.start_date.format("yyyyMM");
	return obj;
}

function convertEventToClient(data) {
	var obj = {};
	obj.id = data.id;
	obj.projectId = data.projectId;
	obj.text = data.text;
	obj.userId = data.userId;
	obj.start_date = new Date(data.start_date);
	obj.end_date = new Date(data.end_date);
	return obj;
}

scheduler.attachEvent("onTemplatesReady", function() {
	scheduler.renderEvent = function(container, ev) {
		var container_width = container.style.width; // e.g. "105px"
		// move section
		var html = "<div class='dhx_event_move my_event_move' style='width: " + container_width + "'></div>";
		
		// container for event's content
		html+= "<div class='my_event_body'>";
		html += "<span class='event_date'>";
		//two options here:show only start date for short events or start+end for long
		if ((ev.end_date - ev.start_date)/60000>40){//if event is longer than 40 minutes
			html += scheduler.templates.event_header(ev.start_date, ev.end_date, ev);
			html += "</span><br/>";
		} else {
			html += scheduler.templates.event_date(ev.start_date) + "</span>";
		}
		
		// displaying event's text
		var prefix = "";
		for(var i in scheduler.projectList) {
			if(ev.projectId == scheduler.projectList[i].id) {
				prefix = "["+scheduler.projectList[i].name+"]";
				break;
			}
		}
		html += "<span>" +prefix + scheduler.templates.event_text(ev.start_date,ev.end_date,ev)+"</span>" + "</div>";
		
		// resize section
		html += "<div class='dhx_event_resize my_event_resize' style='width: " +
		container_width + "'></div>";
		container.innerHTML = html;
		return true; //required, true - display a custom form, false - the default form
	};
	
	scheduler.showLightbox = function(id) {
		var ev = scheduler.getEvent(id);
		scheduler.startLightbox(id, html("my_form"));
		//html("tag").focus();
		/*
		if(ev.text == 'New event') {
			ev.text = '';
		}
		*/
		html("text").value = ev.text || "";
		if(ev.projectId > 0) {
			html("projectId").value = ev.projectId;	
		} else {
			html("projectId").value = "-1";
		}
	};
	
	scheduler.attachEvent("onEventAdded", function(id, e) {
		if(!e.text) {
			scheduler.deleteEvent(id)
			alert("Insert Schedule Event Text");
			return;
		}
		var obj = convertEventToServer(e);
		  this.insertSchedule(obj, function(data){
			 if(data.resultBody) {
				 scheduler.changeEventId(id, data.resultBody.scheduleId);
				obj = {};
			 }
		  }, 
		  function(){
			  alert('fail');
		  });
	  });
	  scheduler.attachEvent("onEventChanged", function(id,e){
		  var obj = convertEventToServer(e, id);
		  
		  this.updateSchedule(obj, function(data){
		  	
			 
		  }, 
		  function(){
			  alert('fail');
		  });
	  });
	scheduler.attachEvent("onEventDeleted", function(id, e){
		if(!e.text) {
			return;
		}
		  
		this.deleteSchedule(id, function(data){
			 if(data.resultBody) {
			 }
		}, 
		function(){
			alert('fail');
		});
	});
	scheduler.attachEvent("onEventCancel", function(id, flag){

	});
	scheduler.attachEvent("onEmptyClick", function (date, e){
		  if(scheduler.getState().mode == "month") {
			  scheduler.setCurrentView(date, "week");
		  }
	});
	scheduler.templates.event_bar_text = function(start,end,ev){
		var prefix = "";
		for(var i in scheduler.projectList) {
			if(ev.projectId == scheduler.projectList[i].id) {
				prefix = "["+scheduler.projectList[i].name+"]";
				break;
			}
		}
		return prefix+ scheduler.templates.event_text(ev.start_date,ev.end_date,ev);
	};
	scheduler.attachEvent("onBeforeViewChange", function(old_mode,old_date,mode,date){
		var y = date.getFullYear();
		var m = date.getMonth();
		
		var pStartDate = new Date();
		pStartDate.setYear(y);
		pStartDate.setMonth(m-1);
		var pEndDate = new Date();
		pEndDate.setYear(y);
		pEndDate.setMonth(m+1);
		  
		var getScheduleParma = {};
		getScheduleParma.userId = scheduler.userId;
		getScheduleParma.startMonth = pStartDate.format("yyyyMM");
		getScheduleParma.endMonth = pEndDate.format("yyyyMM");
		  
		this.selectSchedule(getScheduleParma, function(data){
			if(data.resultBody && data.resultBody.scheduleList) {
				var targetList = [];
				for(var i = 0; i < data.resultBody.scheduleList.length; i++) {
					var schedule = data.resultBody.scheduleList[i];
					targetList.push(convertEventToClient(schedule))
				}
				scheduler.parse(targetList, 'json');
			}
		}, 
		function(){
			alert('fail');
		});
		  
		return true;
	});
});