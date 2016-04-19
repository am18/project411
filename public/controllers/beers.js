var app1 = angular.module('app1', []);


app1.controller('ctrl1', function($scope, $http) {

	$scope.input;

	$scope.$watch("input", function(newValue, oldValue) {
    
	    if (newValue != oldValue) {

	    	$scope.data= [];
	      
			$http({ 
		    	method: 'GET',
		    	url: '/get/' + $scope.input
			}).then(function successCallback(response) {
				$scope.data=response.data;
				console.log(response.data);

		  	}, function errorCallback(response) {

		  	});
	    
	    }

  	});

});