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

app1.controller('favorites_ctrl', function($scope, $http) {

	$scope.input;
	$scope.data = {beerId: $scope.input};

	$scope.addFavorite = function() {

		$http({ 
	    	method: 'POST',
	    	url: '/favorites',
	    	data: "beerId=" + $scope.input,
	    	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    		
    		}).then(function successCallback(response) {
			$scope.data=response.data;
			console.log(response.data);

		  	}, function errorCallback(response) {

		  	});	
        
    };

	$scope.getFavorites = function() {
        
		$http({ 
	    	method: 'GET',
	    	url: '/favorites'
		}).then(function successCallback(response) {
			$scope.data=response.data;
			console.log(response.data);

	  	}, function errorCallback(response) {

	  	});	
        
    };


});
