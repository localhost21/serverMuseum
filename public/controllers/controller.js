var myApp = angular.module('myApp', ['ngRoute', 'ui-leaflet','textAngular', 'ui.bootstrap','app.routes', 'app.directives']).config(function($sceDelegateProvider) {
//'leaflet-directive', 'ui-leaflet'
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

	
	
	

myApp.factory('accessFac', function($window, $http) {
  var obj = {}
  obj.access = false;
  var i = 0; 
 
  obj.getImage = function(){
	 return $window.localStorage['map'];
  }
  
  obj.setImage = function(image){
	 $window.localStorage['map'] = image;
	  
  }
 
  obj.getPermission = function(helper) { //set the permission to true
    obj.access = true;
	
	 $window.localStorage['jwtToken'] = helper;
	i++;
	
  }
  obj.checkPermission = function() {
	return obj.access;
    
  }
  obj.getToken = function(){
	 return $window.localStorage['jwtToken'];//obj.token[i - 1];
  }
  
   
  
  
  
  return obj;
});

myApp.run(function($http, accessFac){
	$http.get('/museum/' + accessFac.getToken()).success(function(response) {
	 var museumData = response;
	 var museumH = "";						
	angular.forEach( museumData, function(museumH) {
		accessFac.setImage(museumH.map);
	});
  });  
});



myApp.controller('loginCtrl', function($scope, $http, $timeout, $location, $window, accessFac) {
  $scope.getAccess = function() {
	var creds = $scope.username +":" + $scope.password;
	
	$http.get('/credentials/' + creds, {
  }).success(function(response) {
	  $scope.data = response;

  });
		
	$timeout(function(){
	 
    if ($scope.data.status === "true") {		
		accessFac.getPermission($scope.data.token); //call the method in acccessFac to allow the user permission.
		$window.location.href = "/#/museumsverwaltung";
		$timeout(function(){
			
			//$window.location.reload(true);
		},100);

    } else {
      Alert.render("Falsche Zugangsdaten!");
    }}, 2500);
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





myApp.controller('custoCtrl', function($scope, $timeout, $location, $http, leafletData, leafletBoundsHelpers,shareClickedId,textAngularManager,accessFac) {

  $http.get('/museum/' + accessFac.getToken()).success(function(response) {
	 $scope.museumData = response;
	$scope.museumH = "";						
	angular.forEach($scope.museumData, function(museumH) {
		$scope.logo = museumH.logo;
		accessFac.setImage(museumH.map);
	});
  });  
  
var refresh = function(){
	 $http.get('/museum/' + accessFac.getToken()).success(function(response) {
			$scope.datalicous = response;
			$scope.mn = "";						
			angular.forEach($scope.datalicous, function(mn) {
				$scope.id = mn._id;
				$scope.de = mn.de;
				$scope.en = mn.en;
				$scope.museumsname = mn.museumsname;
			});
			
			$scope.htmlcontent = $scope.de;
      });
  $scope.clickedLng = "de";	
	 
  $scope.uploadText = function(hi) {
	  if($scope.clickedLng==="de"){
			$http.put('/museumDE/' + $scope.id, {"de":$scope.htmlcontent}).success(function(response) {refresh();});
		}else if($scope.clickedLng==="en"){
			$http.put('/museumEN/' + $scope.id, {"en":$scope.htmlcontent}).success(function(response) {refresh();});
		}		
    };
  
  
  $scope.uploadName = function() {		
		$http.put('/museumName/' + $scope.id, {"museumsname":$scope.newName}).success(function(response) {});
		
			refresh();
			
			
		
    }

  
  

	

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
	events: {},
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
		  doRefresh: true,
          url: accessFac.getImage(),
          bounds: [
            [-100, -180],
            [100, 190]
          ],
          layerParams: {
            showOnSelector: false,
            noWrap: true,
			doRefresh: true
          }
        }
      }
    },
	defaultIcon: {},
	hover: {
       iconUrl: 'https://dl.dropboxusercontent.com/s/cyxel8hh3jddzqs/pos.png?dl=0'
    },
    legend: {
      position: 'bottomright',
      colors: ['#1874cd'],
      labels: ['Exponatstandorte']
    },
    markers: $scope.markers = [],
	addHover : function(name){
		angular.forEach($scope.markers, function(ma) {			
		if(ma.name===name){	
		ma.icon = $scope.hover;
		}
	  }); 	
	},
	removeHover: function(name){
		angular.forEach($scope.markers, function(ma) {			
		if(ma.name===name){		
		ma.icon = {};
		}
	  }); 	
	}
    
  });
  

  $scope.$on("leafletDirectiveMap.leafletMap.click", function(event, args) {
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
      $http.post('/markers/' + accessFac.getToken(), {
        message: messageR.message,
		name: messageR.name,
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng,
        draggable: true,
        focus: false,
      }).success(function(response) {

      });
	  //window.location.reload('custo');
	  refresh();
    }

  });
  
  
  
  $scope.remove = function(name) {
      $http.delete('/deleteSingleMarkers/' + name).success(function(response) {
        refresh();
      });
	  //window.location.reload('museumsverwaltung');
    }
    $scope.changeSingleMarker = function(message) {
      $http.get('/markersModify/' + message).success(function(response) {
         $scope.markersHelper = response;
		 
      });
    }
    $scope.update = function() {
	  $http.get('/orgName/' + accessFac.getToken()).success(function(response) {
         $scope.organization = response;
		 
     
      $http.put('/markers/' + $scope.organization, $scope.markersHelper).success(function(response) {
        $scope.markersHelper = "";
        refresh();
      });
	   });
    }
    $scope.deselect = function() {
      $scope.markersHelper = "";
    }
  
  
  
  
  
  
  
  $http.get('/markers/' + accessFac.getToken()).success(function(response) {
    $scope.data = response;
    $scope.ma = "";
	$scope.predicate = '-name';
    angular.forEach($scope.data, function(ma) {
		ma.name = parseFloat(ma.name);
      $scope.markers.push({
		name: ma.name,
        lat: ma.lat,
        lng: ma.lng,
        draggable: ma.draggable,
        focus: ma.focus,
        message: ma.message,
		opacity: ma.opacity,
		icon: {}
      });
    });
  });
  
  
  $scope.greaterThan = function(prop, val){
    return function(item){
      return item[prop] > val;
    }
}
  
  
  
  
  
  
    
  
  $scope.deleteMarkers = function(){
	  
	  $http.delete('/markers/' + accessFac.getToken()).success(function(response) {
        
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
	 
$http.post('/markersNew/' + accessFac.getToken(), markersInsert).success(function(response) {
		refresh();
      });
	//window.location.reload('custo');
	refresh();
  };
  
  
  $scope.archiveMarkerJSON = function(){
	$http.get('/markers').success(function(response) {
    $scope.data = response;
	$scope.bi = "";
  });
  
  $http.post('/archiveMarkers/' + accessFac.getToken(), $scope.data).success(function(response) {
  });
  //window.location.reload('custo');
  refresh();
  
  }
  
  
  $http.get('/archived/' + accessFac.getToken()).success(function(response) {
      $scope.h= response;
	  $scope.receivedMarkers ="";
	  //window.alert($scope.receivedMarkers.name);
    });
 
  
$scope.loadMarkers = function(reqMarcID, index) {
    $scope.clickedID = reqMarcID; //name des geklickten, funktoniert
	//$scope.deleteMarkers();
	shareClickedId.setId($scope.clickedID);
	
	 $timeout(function(){ 
	$http.get('/archiveMarkers/' + $scope.clickedID).success(function(response) {
      $scope.h= response;
	 
	  $scope.receivedMarkers ="";

	  //$scope.$apply();
	  
	  
	 
    });
  
	  
	
	var markersInsert =  [];
	 //window.alert(document.getElementById('godzilla').innerHTML);
	 
	 markersInsert.push(document.getElementById('godzilla').innerHTML );
	 markersInsert = JSON.parse(markersInsert);
	 
$http.post('/markersNew/' + accessFac.getToken(), markersInsert).success(function(response) {
		//window.location.reload('custo');
		refresh();
      });
	},1000);
	  
  };
  
  document.getElementById("myFormLogo").action = "/api/photo/logo/" + accessFac.getToken();
  document.getElementById("myFormMap").action = "/api/photo/map/" + accessFac.getToken();
    


 
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
var refresh = function(){
	

	$http.get('/getBeacons').success(function(response) {
      $scope.data = response;
      $scope.beacon = "";
      $scope.i = 0;
      angular.forEach($scope.data, function(beacon) {
        $scope.i++;
		if(beacon.color==="blueberry"){
			beacon.img = "https://dl.dropboxusercontent.com/s/i1zbzaudgg90mpe/violet.png?dl=0";
		}else if(beacon.color==="ice"){
			beacon.img = "https://dl.dropboxusercontent.com/s/j0nohfh7easxsnj/blue.png?dl=0";
		}else if(beacon.color==="mint"){
			beacon.img = "https://dl.dropboxusercontent.com/s/q75k71vzwf9gdbu/mint.png?dl=0";
		}
      });
    });
	
	$scope.edit = function(id) {
      $http.get('/beaconModify/' + id).success(function(response) {
        $scope.beacon = response;
      });
    }
	
	$scope.deselect = function() {
      $scope.beacon = "";
    }
	
	$scope.saveBeaconSettings = function(){
		$http.put('/setBeacons', $scope.beacon).success(function(response) {
		});
		$scope.beacon = "";
		window.alert("Erfolgreich gespeichert, Daten werden demnächst aktualiert");
	}
	
};
refresh();	
});



myApp.controller('exponatCtrl', function($scope, $http, $location, $anchorScroll, $timeout, accessFac){
	$http.get('/museum/' + accessFac.getToken()).success(function(response) {
	 $scope.museumData = response;
	$scope.museumH = "";						
	angular.forEach($scope.museumData, function(museumH) {
		$scope.logo = museumH.logo;
		accessFac.setImage(museumH.map);
	});
  });  

	
	
	
	var refresh = function() {
      $http.get('/backend/'+ accessFac.getToken()).success(function(response) {
        $scope.backend = response;
        $scope.exponat = "";
        $scope.sortType = 'ide';
        $scope.sortReverse = false;
        $scope.searchName = '';
        angular.forEach($scope.backend, function(exponat) {
          exponat.ide = parseFloat(exponat.ide);
        });
        $http.get('/backend_count/'+accessFac.getToken()).success(function(response) {
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
		if(a!=""){
			$scope.exponat.bild = a.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}        
        $http.post('/backend/' + accessFac.getToken(), $scope.exponat).success(function(response) {
			refresh();
        });
		//window.location.reload('museumsverwaltung');
      }
    }
    $scope.remove = function(name) {
      $http.delete('/backend/' + name).success(function(response) {
        refresh();
      });
	  //window.location.reload('museumsverwaltung');
    }
    $scope.edit = function(name) {
      $http.get('/backendModify/' + name).success(function(response) {
        $scope.exponat = response;
        document.getElementById('hinzufügen').style = "display: none";
      });
    }
    $scope.update = function() {
      $http.put('/backend/' + $scope.exponat.name, $scope.exponat).success(function(response) {
        document.getElementById('hinzufügen').style = "display: inline-block";
        refresh();
      });
	  //window.location.reload('museumsverwaltung');
    }
    $scope.deselect = function() {
      document.getElementById('hinzufügen').style = "display: inline-block";
      $scope.exponat = "";
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



myApp.controller('orgCtrl',function($scope, $http, accessFac){
	$http.get('/orgName/' + accessFac.getToken()).success(function(response) {
         $scope.org = response;
	});
	 
});

