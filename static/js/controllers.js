'use strict';

/* Controllers */
angular.module('schedo.controllers', [])
.controller('scheduleCtrl', function($scope, $rootScope, scheduleService) {
	scheduler.insertSchedule = scheduleService.insertSchedule;
	scheduler.updateSchedule = scheduleService.updateSchedule;
	scheduler.deleteSchedule = scheduleService.deleteSchedule;
	scheduler.selectSchedule = scheduleService.selectSchedule;
	scheduler.userId = $rootScope.user.userId;
	scheduler.init('_scheduler', new Date(), "month");
})
.controller('projectCtrl', function($scope, $rootScope, projectService) {
	projectService.selectService(function(data){
		
	},
	function(){
	});
	$scope.saveProject = function() {		
		if(!$scope.project.members) {
			$scope.project.members = [];
		}
		if(!$scope.project.status) {
			$scope.project.status = "O";
		}
		var selfMember = {};
		selfMember.memberId = $rootScope.user.userId;
		selfMember.memberAuthType = "O";
		$scope.project.members.push(selfMember);
		projectService.insertProject($scope.project, function(data){
			if(data.resultBody && data.resultCode == 200) {
				$scope.showPopup = false;
			}
		}, 
		function(){
			alert("insert project fail");
		});
	};
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
			if(data.resultBody && data.resultCode == 200) {
				var tags = {};
				
				// get tags
				for(var i = 0; data.resultBody.statisticsList && i < data.resultBody.statisticsList.length; i++) {
					var statistics = data.resultBody.statisticsList[i];
					tags[statistics.Tag] = true;
				}
				
				// make View Model
				$scope.viewModelList = [];
				for(var k in tags) {
					var viewModel = {};
					viewModel.tag = k;
					viewModel.statistics = scheduleService.makeEmptyDateObjList($scope.selectedYear, $scope.selectedMonth);
					viewModel.totalDuration = 0;
					
					for(var i = 0; i < viewModel.statistics.length; i++) {
						var dateData = viewModel.statistics[i];
						
						for(var j = 0; j < data.resultBody.statisticsList.length; j++) {
							var statisticsObj = data.resultBody.statisticsList[j];
							if(dateData.fullDate == statisticsObj.StartDay && statisticsObj.Tag == viewModel.tag) {
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