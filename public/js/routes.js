angular.module('app.routes', [])
.config(function($locationProvider, $routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: '/www/login.html',
		controller: 'loginCtrl'
	})
	.when('/museumsverwaltung', {
		templateUrl: '/www/museumsverwaltung.html',
		controller: 'exponatCtrl',
		resolve: {					
			check : function(accessFac, fehlermeldungFac) {
                  if(accessFac.getToken()===""){
						fehlermeldungFac.openCustomModal();					
					}
                }
		},
		
	})
	.when('/getbeacons', {
		templateUrl: '/www/beacons.html',
		controller: 'beaconsCtrl',
		resolve: {					
			check : function(accessFac, fehlermeldungFac) {
                  if(accessFac.getToken()===""){
						fehlermeldungFac.openCustomModal();					
					}
                }
		},
	})
	.when('/hilfe', {
		templateUrl: '/www/hilfe.html',
		controller: 'AppCtrl',
		resolve: {					
			check : function(accessFac, fehlermeldungFac) {
                  if(accessFac.getToken()===""){
						fehlermeldungFac.openCustomModal();					
					}
                }
		},
	})
	.when('/custo', {
		templateUrl: '/www/cust.html',
		controller: 'custoCtrl',
		resolve: {					
			check : function(accessFac, fehlermeldungFac) {
                  if(accessFac.getToken()===""){
						fehlermeldungFac.openCustomModal();					
					}
                }
		},
	})
	.otherwise({
        redirectTo:'/'
      })
	
	
});