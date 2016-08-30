var myApp = angular.module('myApp', ['ngRoute', 'ui-leaflet','textAngular', 'ui.bootstrap','app.routes', 'app.directives']).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://dl.dropboxusercontent.com/**',
    'http://www.w3schools.com/**',
    'https://photos-3.dropbox.com/**',
    'https://dl.dropbox.com/**',
    'https://www.dropbox.com/**',
    'https://*.dropbox.com/**',
    'https://cloud.estimote.com/**'
  ]);

  // The blacklist overrides the whitelist so the open redirect here is blocked.
  $sceDelegateProvider.resourceUrlBlacklist([

  ]);
});

var image = '/www/img/defaultPlan.png';

myApp.factory('accessFac', function() {
  var obj = {}
  obj.access = true;
  obj.getPermission = function() { //set the permission to true
    obj.access = true;
  }
  obj.checkPermission = function() {
	  console.log(obj.access);
    return obj.access; //returns the users permission level
  }
  return obj;
});

myApp.controller('loginCtrl', function($scope, $http, $timeout, $location, $window, accessFac) {
  $scope.getAccess = function() {
	var creds = $scope.username +":" + $scope.password;
	
	$http.get('/credentials/' + creds, {
  }).success(function(response) {
	  $scope.answer = response;
  });
		
	$timeout(function(){
	console.log($scope.answer);	
	 
    if ($scope.answer === "true") {
		accessFac.getPermission(); //call the method in acccessFac to allow the user permission.
		$timeout(function(){
			$window.location.href = "/#/museumsverwaltung";
			window.location.reload(true);
		},1000);

    } else {
      Alert.render("Falsche Zugangsdaten!");
    }}, 1000);
  }
  
  
  function CustomAlert() {
	  
    this.render = function(dialog) {
      var winW = window.innerWidth;
      var winH = window.innerHeight;
      var dialogoverlay = document.getElementById('dialogoverlay1');
      var dialogbox = document.getElementById('dialogbox1');
      dialogoverlay.style.display = "block";
      dialogoverlay.style.height = winH + "px";
      dialogbox.style.left = (winW / 2) - (350 * .5) + "px";
      dialogbox.style.top = "100px";
      dialogbox.style.display = "block";
      document.getElementById('dialogboxhead1').innerHTML = "Fehlermeldung!";
      document.getElementById('dialogboxbody1').innerHTML = dialog;
      document.getElementById('dialogboxfoot1').innerHTML = '<a href="javascript:window.location.reload(true)" class="btn btn-primary"> ok</a>';
    }
	
	
  }
  var Alert = new CustomAlert();
});





myApp.controller('custoCtrl', function($scope, $timeout, $location, $http, leafletData, leafletBoundsHelpers,shareClickedId,textAngularManager) {
	 $http.get('/museum', {
        cache: true
      }).success(function(response) {
			$scope.datalicous = response;
			$scope.mn = "";
			angular.forEach($scope.datalicous, function(mn) {
				$scope.id = mn._id;
				$scope.orightml = mn.de;
				$scope.museumsname = mn.museumsname;
			});
			$scope.htmlcontent = $scope.orightml;
      });
	 
  $scope.uploadText = function(hi) {
     /*
        $http.post('/museumDE', $scope.museumsname).success(function(response) {
          window.location.reload('custo');
        });
		*/
		
		$http.put('/museumDE/' + $scope.id, {"de":$scope.htmlcontent}).success(function(response) {
        console.log("de beschreib hochgeladen");
		window.location.reload('custo');
      });
		
    };
  
  
  $scope.uploadName = function() {
		$http.put('/museumName/' + $scope.id, {"museumsname":$scope.newName}).success(function(response) {
		window.location.reload('custo');
      });
		
    }

 $http.get('/api/photo/logo', {
    cache: true
  }).success(function(response) {
	  $scope.logo = response;
  });  

  

var refresh = function(){
	
	

  var maxBounds = leafletBoundsHelpers.createBoundsFromArray([
    [-135, -300],
    [135, 300]
  ]);
  angular.extend($scope, {
    defaults: {
      scrollWheelZoom: true,
      maxZoom: 2,
      zoom: -1,
    },
    center: {
      lat: 0,
      lng: 0,
      zoom: 0
    },
    maxBounds: maxBounds,
    layers: {
      baselayers: {
        Gesamtansicht: {
          name: 'Gesamtansicht',
          type: 'imageOverlay',
          url: image,
          bounds: [
            [-100, -180],
            [100, 190]
          ],
          layerParams: {
            showOnSelector: false,
            noWrap: true,
          }
        }
      }
    },
    legend: {
      position: 'bottomright',
      colors: ['#1874cd'],
      labels: ['Exponatstandorte']
    },
    markers: $scope.markers,
    events: {}
  });
  
  $scope.markers = [];
  
  $http.get('/markers', {
    cache: true
  }).success(function(response) {
    $scope.data = response;
    $scope.ma = "";
    angular.forEach($scope.data, function(ma) {
      $scope.markers.push({
        lat: ma.lat,
        lng: ma.lng,
        draggable: ma.draggable,
        focus: ma.focus,
        message: ma.message,
		opacity: ma.opacity
      });
    });
  });
  
  $scope.deleteMarkers = function(){
	  
	  $http.delete('/markers').success(function(response) {
        
      });
	  
	 
	var markersInsert =  [];
	 //window.alert(document.getElementById('godzilla').innerHTML);
	 
	 markersInsert.push({"name":"walker",
        lat:0,
        lng:0,
        message:"",
        type:"xyz",
        opacity:0,
        icon:""});
	 
$http.post('/markersNew', markersInsert).success(function(response) {
		window.location.reload('custo');
      });
	window.location.reload('custo');
  };
  
  
  $scope.archiveMarkerJSON = function(){
	$http.get('/markers', {
    cache: true
  }).success(function(response) {
    $scope.data = response;
	$scope.bi = "";
  });
  
  $http.post('/archiveMarkers', $scope.data, {
    cache: true
  }).success(function(response) {
  });
  window.location.reload('custo');
  
  }
  
  
  $http.get('/archiveMarkers', {
      cache: true
    }).success(function(response) {
      $scope.h= response;
	  $scope.receivedMarkers ="";
	  //window.alert($scope.receivedMarkers.name);
    });
 
  
$scope.loadMarkers = function(reqMarcID, index) {
    $scope.clickedID = reqMarcID; //name des geklickten, funktoniert
	//$scope.deleteMarkers();
	shareClickedId.setId($scope.clickedID);
	
	 $timeout(function(){ 
	$http.get('/archiveMarkers/' + $scope.clickedID, {
      cache: true
    }).success(function(response) {
      $scope.h= response;
	 
	  $scope.receivedMarkers ="";

	  //$scope.$apply();
	  
	  
	 
    });
  
	  
	
	var markersInsert =  [];
	 //window.alert(document.getElementById('godzilla').innerHTML);
	 
	 markersInsert.push(document.getElementById('godzilla').innerHTML );
	 markersInsert = JSON.parse(markersInsert);
	 
$http.post('/markersNew', markersInsert).success(function(response) {
		window.location.reload('custo');
      });
	},1000);
	  
  };
  
  
  
  

  $scope.$on("leafletDirectiveMap.click", function(event, args) {
    var leafEvent = args.leafletEvent;
    $scope.markers.push({
      lat: leafEvent.latlng.lat,
      lng: leafEvent.latlng.lng,
      draggable: true,
      focus: true,
      getMessageScope: function() {
        return $scope;
      },
      message: "<div ng-include src=\"'www/template.html'\"></div>"
    });
    $scope.uploadMarkers = function(messageR) {
      $http.post('/markers', {
        message: messageR,
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng,
        draggable: true,
        focus: false,
      }).success(function(response) {

      });
	  window.location.reload('custo');
    }

  });
  
};

refresh();

});


myApp.filter('myFilter', function (shareClickedId) {
    return function(input) {
	var out = [];
	var clickedID = shareClickedId.getId();
	if(clickedID===""){
		angular.forEach(input, function(blup){
			out.push(blup);
		})
		return out
	}else{
		angular.forEach(input, function(blup){
			if(blup._id===clickedID){
				out.push(blup);
			}
		})
	return out
	};	
}
});


myApp.controller('InputDropdownController', [function() {
  this.selectedDropdownItem = null;
  this.dropdownItems = ['DE', 'EN'];
}]);


myApp.factory('shareClickedId', function() {
  var obj = {};
  obj.params="";
  obj.setId = function(p1) {
    obj.params = p1;
  }
  obj.getId = function() {
    return obj.params;
  }
  return obj;
});

myApp.controller('AppCtrl',  function($scope, $http, $location, $anchorScroll) {

	  
	   $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   }
  
	  $http.get('/api/photo/map', {
    cache: true
  }).success(function(response) {
	  if(response!="/uploads/"){
		  image = response;
	  }

  });  
	  
    function ok() {
      document.getElementById('dialogbox').style.display = 'none';
      document.getElementById('dialogoverlay').style.display = 'none';
    }

    function CustomAlert() {
      this.render = function(dialog) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        dialogbox.style.left = (winW / 2) - (350 * .5) + "px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Fehlermeldung!";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<a href="javascript:window.location.reload(true)" class="btn btn-primary"> ok</a>';
      }

    }
    var Alert = new CustomAlert();
});

myApp.controller('beaconsCtrl', function($scope, $http){
	$http.get('/getBeacons', {
      cache: true
    }).success(function(response) {
      $scope.data = response;
      $scope.beacon = "";
      $scope.i = 0;
      angular.forEach($scope.data, function(beacon) {
        $scope.i++;
      });
    });
});



myApp.controller('exponatCtrl', function($scope, $http, $location, $anchorScroll, $timeout){
	
	$scope.top = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('top');

      // call $anchorScroll()
      $anchorScroll();
    };
	
	var refresh = function() {
      //'/backend' is the route where the data is from
      $http.get('/backend', {
        cache: true
      }).success(function(response) {
        $scope.backend = response;
        $scope.exponat = "";
        $scope.sortType = 'ide';
        $scope.sortReverse = false;
        $scope.searchName = '';
        angular.forEach($scope.backend, function(exponat) {
          exponat.ide = parseFloat(exponat.ide);
        });
        $http.get('/backend:count').success(function(response) {
          $scope.number = response;
        });
      });
    }
	refresh();

   
		
    $scope.addexponat = function() {
      if (3 > document.getElementById('ide').value.length) {
        Alert.render("ID muss mindestens dreistellig sein");
      } else {
        var a = $scope.exponat.bild;
        $scope.exponat.bild = a.replace(/www.dropbox/g, "dl.dropboxusercontent");
        $http.post('/backend', $scope.exponat).success(function(response) {
          
        });
		window.location.reload('museumsverwaltung');
      }
    }
    $scope.remove = function(id) {
      $http.delete('/backend/' + id).success(function(response) {
        refresh();
      });
	  window.location.reload('museumsverwaltung');
    }
    $scope.edit = function(id) {
      $http.get('/backend/' + id).success(function(response) {
        $scope.exponat = response;
        document.getElementById('hinzufügen').style = "display: none";
      });
    }
    $scope.update = function() {
      $http.put('/backend/' + $scope.exponat._id, $scope.exponat).success(function(response) {
        document.getElementById('hinzufügen').style = "display: inline-block";
        refresh();
      });
	  window.location.reload('museumsverwaltung');
    }
    $scope.deselect = function() {
      document.getElementById('hinzufügen').style = "display: inline-block";
      $scope.exponat = "";
    }
	
	 var startProductBarPos=-1;
    window.onscroll=function(){
        var bar = document.getElementById('productMenuBar');
        if(startProductBarPos<0)startProductBarPos=findPosY(bar);

        if(pageYOffset>startProductBarPos){
            bar.style.position='fixed';
            bar.style.top="50px";
        }else{
            bar.style.position='relative';
			bar.style.top="0px";
        }

    };


    function findPosY(obj) {
        var curtop = -50;
        if (typeof (obj.offsetParent) != 'undefined' && obj.offsetParent) {
            while (obj.offsetParent) {
                curtop += obj.offsetTop;
                obj = obj.offsetParent;
            }
            curtop += obj.offsetTop;
        }
        else if (obj.y)
            curtop += obj.y;
        return curtop;
    }
	
  
	
	
	
});
