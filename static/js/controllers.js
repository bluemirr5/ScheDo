'use strict';

/* Controllers */
angular.module('schedo.controllers', [])
  .controller('todoCtrl', function($scope, todoService) {
	  $scope.todoList = [];
	  var userId = 'testUser';//TODO 추후 교체
	  
	  var queryModel = {
		  todoModel:{author :userId}
	  };
	  todoService.selectTodoList(queryModel, function(data){
		  console.log(data.resultBody);
		  if(data.resultBody) {
			  $scope.todoList = data.resultBody.todoList;
		  }
	  },
	  function(){
	  });
	  
	  $scope.insertTodo = function(){
		  var todo = {};
		  todo.title = $scope.title;
		  todo.author = userId;
		  todoService.insertTodo(todo, function(){
			  $scope.todoList.push(todo);
			  $scope.title = '';
		  }, 
		  function(){
			  alert('insert Todo fail');
		  });
	  };
	  
	  $scope.deleteTodo = function(todo) {
		  todoService.deleteTodo(todo.idx, function() {
			  var removeTargetIndex = -1;
			  for(var i = 0; $scope.todoList && i < $scope.todoList.length; i++) {
				  if($scope.todoList[i].idx == todo.idx) {
					  removeTargetIndex = i;
					  break;
				  }
			  }
			  $scope.todoList.splice(removeTargetIndex, 1);
		  },
		  function() {
			  
		  });
	  };
	  
	  $scope.updateTodoOrder = function() {
		  var todoOrderQueryMode = {};
		  todoOrderQueryMode.author = 'testUser';
		  todoOrderQueryMode.todoOrderModelList = [];
		  if($scope.todoList) {
			  for(var i = 0; $scope.todoList && i < $scope.todoList.length; i++) {
				  var orderModel = {};
				  orderModel.todoIdx = $scope.todoList[i].idx;
				  orderModel.todoAuthor = $scope.todoList[i].author;
				  orderModel.todoOrder = $scope.todoList.length - 1 - i;
				  todoOrderQueryMode.todoOrderModelList[i] = orderModel;
			  }
			  todoService.updateTodoOrder(todoOrderQueryMode, function(){
				  
			  },
			  function(){
				  
			  }
			  );
		  }
	  };
	  if($("#sortDiv").sortable) {
		  $("#sortDiv").sortable({
			  start:function(e, ui) {
				  ui.item.data('start', ui.item.index());
			  },
			  update:function(e, ui) {
				  var start = ui.item.data('start'),
				  end = ui.item.index();
				  
				  $scope.todoList.splice(end, 0, $scope.todoList.splice(start, 1)[0]);
				  $scope.$apply();
				  $scope.updateTodoOrder();
			  }
		  });
	  }
  })
  .controller('scheduleCtrl', function($scope, scheduleService) {
	  console.log("Aaaaaaaaaaaa");
	  scheduler.insertSchedule = scheduleService.insertSchedule;
	  scheduler.updateSchedule = scheduleService.updateSchedule;
	  scheduler.deleteSchedule = scheduleService.deleteSchedule;
	  scheduler.selectSchedule = scheduleService.selectSchedule;
	  
	  scheduler.init('_scheduler', new Date(), "month");
  });