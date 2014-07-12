'use strict';

/* Services */
angular.module('schedo.services', []).
	factory('todoService', function($http){
		var serviceObj = {
			insertTodo : function(data, success, fail) {
				$http({
					method:'POST',
					url:'/api/todo',
					//header: '',
					data:data
				}).success(success).error(fail);
			},
			deleteTodo : function(idx, success, fail) {
				$http({
					method:'DELETE',
					url:'/api/todo/'+idx
					//header: '',
				}).success(success).error(fail);
			},
			selectTodoList : function(data, success, fail) {
				$http({
					method:'POST',
					url:'/api/todoList',
					data:data
				}).success(success).error(fail);
			},
			updateTodoOrder : function(data, success, fail) {
				$http({
					method:'POST',
					url:'/api/todoOrder/'+data.author,
					data:data
				}).success(success).error(fail);
			}
		};
		return serviceObj;
	}).
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
			}
		};
		return serviceObj;
	}
);
