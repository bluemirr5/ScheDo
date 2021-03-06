'use strict';

/* Controllers */
angular.module('schedo.controllers', [])
.controller('scheduleCtrl', function($scope, $rootScope, scheduleService, projectService) {
	scheduler.insertSchedule = scheduleService.insertSchedule;
	scheduler.updateSchedule = scheduleService.updateSchedule;
	scheduler.deleteSchedule = scheduleService.deleteSchedule;
	scheduler.selectSchedule = scheduleService.selectSchedule;
	scheduler.userId = $rootScope.user.userId;
	
	projectService.selectService(function(data){
		if(data.resultCode == 200 && 
			data.resultBody && 
			data.resultBody.projectList.length >= 0) 
		{
			$scope.projectList = data.resultBody.projectList;
			scheduler.projectList = data.resultBody.projectList;
			scheduler.init('_scheduler', new Date(), "month");
		}
	},
	function(){
	});
	
})
.controller('projectCtrl', function($scope, $rootScope, projectService) {
	if(!$scope.project) {
		$scope.project = {};
	}
	$scope.today = function(flagStr) {
		if(flagStr == "S") {
			$scope.project.periodStart = new Date();	
		} else {
			$scope.project.periodEnd = new Date();
		}
	};
	
	$scope.clear = function (flagStr) {
		if(flagStr == "S") {
			$scope.project.periodStart = null;
		} else {
			$scope.project.periodEnd = null;
		}
	};
	
	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};
	
	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	
	$scope.open = function($event, flagStr) {
		$event.preventDefault();
		$event.stopPropagation();
		
		if(flagStr == "S") {
			$scope.startOpened = true;
		} else {
			$scope.endOpened = true;
		}	
	};
	
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	
	$scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	
	$scope.project.periodStart = new Date();	
	$scope.project.periodEnd = new Date();	
	
	var getData = function() {
		projectService.selectService(function(data){
			if(data.resultCode == 200 && 
				data.resultBody && 
				data.resultBody.projectList.length >= 0) 
			{
				$scope.projectList = data.resultBody.projectList	
			}
		},
		function(){
		});
	};
	$scope.setProject = function(projectIndex) {
		if(projectIndex >= 0) {
			$scope.project = {};			
			clone($scope.project, $scope.projectList[projectIndex]);
		} else {
			$scope.project = {status:"O"};
		}
	}
	$scope.saveProject = function() {
		//TODO member 관련 추후 추가
		/* 
		if(!$scope.project.members) {
			$scope.project.members = [];
		}
		var selfMember = {};
		selfMember.memberId = $rootScope.user.userId;
		selfMember.memberAuthType = "O";
		$scope.project.members.push(selfMember);
		*/
		
		if(!$scope.project.name) {
			alert("insert project info");
			$scope.showPopup = false;
			$scope.project = {status:"O"};
			return;
		}
		
		if(!$scope.project.status) {
			$scope.project.status = "O";
		}
		$scope.project.authorId = $rootScope.user.userId;
		if($scope.project.id) {
			projectService.updateProject($scope.project, function(data){
				if(data.resultBody && data.resultCode == 200) {
					$scope.showPopup = false;
					$scope.project = {status:"O"};
					getData();
				}
			},
			function(){
				alert("save project fail");
			});
		} else {
			projectService.insertProject($scope.project, function(data){
				if(data.resultBody && data.resultCode == 200) {
					$scope.showPopup = false;
					$scope.project = {status:"O"};
					getData();
				}
			}, 
			function(){
				alert("save project fail");
			});
		}
	};
	$scope.deleteProject = function(){
		projectService.deleteProject($scope.project, function(data){
			$scope.showPopup = false;
			$scope.project = {status:"O"};
			getData();
		}, 
		function(){
			alert("delete project fail");
		});	
	};
	getData();
	$scope.setProject(-1);
})
.controller('statisticsCtrl', function($scope, $rootScope, scheduleService){
	var now = new Date();
	$scope.selectedYear = now.format("yyyy");
	$scope.selectedMonth = now.format("MM");
	$scope.years = scheduleService.makeYearBeforeAfter();
	
	$scope.getData = function() {
		
		var getStatisticsParma = {};
		getStatisticsParma.userId = $rootScope.user.userId;
		getStatisticsParma.month = $scope.selectedYear + $scope.selectedMonth
		
		scheduleService.selectMonthStatistics(getStatisticsParma, function(data){
			console.log(data);
			if(data.resultBody && data.resultCode == 200) {
				var tags = {};
				
				// get tags
				for(var i = 0; data.resultBody.statisticsList && i < data.resultBody.statisticsList.length; i++) {
					var statistics = data.resultBody.statisticsList[i];
					tags[statistics.ProjectId] = true;
				}
				
				// make View Model
				$scope.viewModelList = [];
				for(var k in tags) {
					var viewModel = {};
					viewModel.projectId = k;
					viewModel.statistics = scheduleService.makeEmptyDateObjList($scope.selectedYear, $scope.selectedMonth);
					viewModel.totalDuration = 0;
					
					for(var i = 0; i < viewModel.statistics.length; i++) {
						var dateData = viewModel.statistics[i];
						
						for(var j = 0; j < data.resultBody.statisticsList.length; j++) {
							var statisticsObj = data.resultBody.statisticsList[j];
							if(dateData.fullDate == statisticsObj.StartDay && statisticsObj.ProjectId == viewModel.projectId) {
								dateData.duration = statisticsObj.Duration/(1000*60*60);
								viewModel.totalDuration += dateData.duration;
							} 
						}
					}
					$scope.viewModelList.push(viewModel);
				}
			}
		}, 
		function(){
			alert('fail');
		});	
	};
	
	$scope.getData();
	
});