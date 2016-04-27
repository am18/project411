var app1 = angular.module('app1', []);


app1.controller('ctrl1', function($scope, $http, beer) {

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


	$scope.openModal = function(beerId) {

		beer.setProperty(beerId);

	};

});

app1.controller('friends', function($scope, $http, user) {

    
	$http({
		method: 'GET',
		url: '/facebook/friends'
	}).then(function successCallback(response) {
		$scope.data=response.data;
		console.log(response.data);

	}, function errorCallback(response) {

	});

	$scope.openModal = function(friend) {

		user.setProperty(friend);

	};


});


app1.controller('friendsModal', function ($scope, $http, user) {


	$scope.setFriend = function () {
		$scope.friend = user.getProperty();
		return $scope.friend;
	}

	// $http({
	// 	method: 'GET',
	// 	url: '/favorites' + $scope.setFriend().userId
	// }).then(function successCallback(response) {
	// 	$scope.data=response.data;
	// 	console.log(response.data);
    //
	// }, function errorCallback(response) {
    //
	// });

});

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

app1.service('beer', function () {
	var beerId;

	return {
		getProperty: function () {
			return beerId;
		},
		setProperty: function(value) {
			beerId = value;
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

app1.controller('beerModal', function ($scope, $http, beer) {


	$scope.setBeer= function () {
		$scope.beer = beer.getProperty();
		return $scope.beer;
	}

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