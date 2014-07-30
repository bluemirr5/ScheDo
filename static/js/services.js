'use strict';

/* Services */
angular.module('schedo.services', []).
	factory('scheduleService', function($http){
		var serviceObj = {
			insertSchedule : function(data, success, fail) {
				$http({
					method:'POST',
					url:'/api/schedule',
					//header: '',
					data:data
				}).success(success).error(fail);
			},
			updateSchedule : function(data, success, fail) {
				$http({
					method:'PUT',
					url:'/api/schedule/'+data.id,
					data:data
				}).success(success).error(fail);
			},
			deleteSchedule : function(id, success, fail) {
				$http({
					method:'DELETE',
					url:'/api/schedule/'+id,
				}).success(success).error(fail);
			},
			selectSchedule : function(data, success, fail) {
				$http({
					method:'GET',
					url:'/api/schedule?userId='+data.userId+'&startMonth='+data.startMonth+'&endMonth='+data.endMonth
				}).success(success).error(fail);
			},
			selectMonthStatistics : function(data, success, fail) {
				$http({
					method:'GET',
					url:'/api/schedule/month?userId='+data.userId+'&month='+data.month
				}).success(success).error(fail);
			},
			makeEmptyDateObjList : function(year, month) {
				var displayDateList = [];
				
				var formakeDate = new Date();
				formakeDate.setYear(year);
				formakeDate.setMonth(month-1);
				formakeDate.setDate(1);
				
				while(formakeDate.format("MM") == month) {
					var obj = {}
					obj.year = formakeDate.format("yyyy");
					obj.month = formakeDate.format("MM");
					obj.date = formakeDate.format("dd");
					if(formakeDate.getDay() == 0 || formakeDate.getDay() == 6) {
						obj.dayType = "holyday";
					} else {
						obj.dayType = "normalday";
					}
					
					obj.fullDate = formakeDate.format("yyyyMMdd");
					formakeDate.setDate(formakeDate.getDate()+1)
					displayDateList.push(obj);
				}	
				return displayDateList;
			},
			makeYearBeforeAfter : function() {
				var years = [];
				var yearDate = new Date();
				yearDate.setYear(yearDate.getFullYear()-5)
				for(var i = 0; i < 10; i++) {
					years.push(yearDate.format("yyyy"));
					yearDate.setFullYear(yearDate.getFullYear()+1);
				}
				return years
			},
		};
		return serviceObj;
	}).
	factory('projectService', function($http){
		var serviceObj = {
			insertProject : function(data, success, fail) {
				$http({
					method:'POST',
					url:'/api/project',
					data:data
				}).success(success).error(fail);
			},
			selectService : function(success, fail) {
				$http({
					method:'GET',
					url:'/api/project/all'
				}).success(success).error(fail);
			}
		};
		return serviceObj;
	});
