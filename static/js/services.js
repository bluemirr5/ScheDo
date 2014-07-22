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
			}
		};
		return serviceObj;
	});
