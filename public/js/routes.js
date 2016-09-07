angular.module('app.routes', [])
.config(function($locationProvider, $routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: '/www/login.html'
	})
	.when('/museumsverwaltung', {
		templateUrl: '/www/museumsverwaltung.html',
		controller: 'exponatCtrl',
		resolve: {
			"check": function(accessFac){
				if(accessFac.checkPermission()===false){    //check if the user has permission -- This happens before the page loads
					window.location="/";
				}
			}
		},
		
	})
	.when('/getbeacons', {
		templateUrl: '/www/beacons.html',
		controller: 'beaconsCtrl',
		resolve: {
			"check": function(accessFac){
				if(accessFac.checkPermission()===false){    //check if the user has permission -- This happens before the page loads
					window.location="/";
				}
			}
		},
	})
	.when('/hilfe', {
		templateUrl: '/www/hilfe.html',
		controller: 'AppCtrl',
		resolve: {
			"check": function(accessFac){
				/*if(accessFac.checkPermission()===false){    //check if the user has permission -- This happens before the page loads
					window.location="/";
				}*/
				if(accessFac.checkPermission()===false){    //check if the user has permission -- This happens before the page loads
					window.location="/";
				}
			}
		}
	})
	.when('/custo', {
		templateUrl: '/www/cust.html',
		controller: 'custoCtrl',
		resolve: {
			"check": function(accessFac){
				if(accessFac.checkPermission()===false){    //check if the user has permission -- This happens before the page loads
					window.location="/";
				}
			}
		}
	})
	.when('/custoConfirm', {
		templateUrl: '/www/confirm.html',
		controller: 'AppCtrl'
	})
	
	
});