var app1 = angular.module('app1', []);


app1.controller('ctrl1', function($scope, $http) {

	$scope.input = 'dfajdsf';
	
	$scope.get = function() {
	
		$scope.output = $scope.input;
		$http({ 
	    	method: 'GET',
        	url: '/get'
		}).then(function successCallback(response) {

			$scope.data=response.data;

	  	}, function errorCallback(response) {

	  	});

  	};

});