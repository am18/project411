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

    $scope.addFavorite = function(beerId) {

        $http({
            method: 'POST',
            url: '/favorites',
            data: "beerId=" + beerId,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}

        }).then(function successCallback(response) {


        }, function errorCallback(response) {

        });

    };

});

app1.controller('friends', function($scope, $http, $modal, $location) {

    $scope.test = 'placeholder';
    
	$http({
		method: 'GET',
		url: '/facebook/friends'
	}).then(function successCallback(response) {
		$scope.data=response.data;
		console.log(response.data);

	}, function errorCallback(response) {

	});
    
    $scope.openModal = function (friend) {
        var modalInstance = $modal.open({
            templateUrl: '#portfolioModal5',
            controller: 'friendsModal',
            resolve: {
                friend: function () {
                    return friend;
                }
            }
        });
    }



});


app1.controller('friendsModal', ['$scope', '$location', 'friend', function ($scope, $location, friend) {

	$scope.test = friend;

}]);

app1.service('user', function () {
	var userId;

	return {
		getProperty: function () {
			return userId;
		},
		setProperty: function(value) {
			userId = value;
		}
	};
});

app1.controller('profile', function($scope, $http) {

    $http({
        method: 'GET',
        url: '/favorites'
    }).then(function successCallback(response) {
        $scope.data=response.data;
        console.log(response.data);

    }, function errorCallback(response) {

    });

});