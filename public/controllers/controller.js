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
      window.alert("Falsche Zugangsdaten!");
    }}, 2500);
  }

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
   
$http.get('/orgName/' + accessFac.getToken()).success(function(response) {
         $scope.organization = response;
		 
     });

   $scope.update = function() {
	  
      $http.put('/markers/' + $scope.organization, $scope.markersHelper).success(function(response) {
        $scope.markersHelper = "";
        refresh();
      });
	   
    }
    $scope.deselect = function() {
      $scope.markersHelper = "";
    }
  
  
  
  
  $http.get('/themenListe/' + accessFac.getToken()).success(function(response) {
    $scope.themaDaten = response;
	$scope.thema="";
	$scope.predicate = '-nummer';
  });
  
  $scope.removeThema = function(nummer) {
      $http.delete('/deleteThemenliste/' + nummer +"/"+  $scope.organization ).success(function(response) {
        refresh();
      });
    }
	
  //ändern	
  $scope.changeThema = function(themennummer) {
	  //$scope.themaNew =({"nummer":themennummer, "name":name});
	   $http.get('/getOneTheme/' + themennummer + "/" + $scope.organization).success(function(response) {
			document.getElementById("SaveCurrentThemeButton").style.display='inline-block';
			document.getElementById("newThemeButton").style.display='none';
			$scope.thema = response;
		});
   }
   
   //aktuelles Speichern
   $scope.updateThema = function(thema) {
	$http.put('/themenliste/'  + thema,  $scope.thema).success(function(response) {
        $scope.thema = "";
		document.getElementById("SaveCurrentThemeButton").style.display='none';
		document.getElementById("newThemeButton").style.display='inline-block';
        refresh();
     });
    }
    
  //neues speichern
  $scope.saveNewTheme = function(){
	  $http.post('/themenliste/' + accessFac.getToken(), $scope.thema).success(function(response) {
			$scope.themaNew = "";
			refresh();
        });
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

  
  
  $http.get('/nonWalkerMarkers/' + accessFac.getToken()).success(function(response) {
    $scope.maData = response;
    $scope.ma = "";
	
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
 
	$http.get('/themenListe/' + accessFac.getToken()).success(function(response) {
		$scope.themaDaten = response;
		$scope.thema="";
	});
   
		
    $scope.addexponat = function() {
      if (3 > document.getElementById('ide').value.length) {
        window.alert("ID muss mindestens dreistellig sein");
      } else if(1 > document.getElementById('bildURL').value.length){
		  window.alert("Bitte geben Sie eine Bild-URL ein");
	  } else if(1 > document.getElementById('expoName').value.length){
		  window.alert("Bitte geben Sie einen Exponat-Namen ein");
	  } else {
        var a = $scope.exponat.bild;
		if(a!=""){
			$scope.exponat.bild = a.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}        
        $http.post('/backend/' + accessFac.getToken(), $scope.exponat).success(function(response) {
			refresh();
        });
      }
    }
    $scope.remove = function(name) {
      $http.delete('/backend/' + name).success(function(response) {
        refresh();
      });
    }
    $scope.edit = function(name) {
      $http.get('/backendModify/' + name).success(function(response) {
        $scope.exponat = response;
        document.getElementById('hinzufügen').style.display = "none";
        document.getElementById('aendernButton').style.display = "inline-block";
      });
    }
    $scope.update = function() {
      $http.put('/backend/' + $scope.exponat.name, $scope.exponat).success(function(response) {
        document.getElementById('hinzufügen').style.display = "inline-block";		
        document.getElementById('aendernButton').style.display = "none";
        refresh();
      });
	  //window.location.reload('museumsverwaltung');
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



myApp.controller('orgCtrl',function($scope, $http, accessFac){
	$http.get('/orgName/' + accessFac.getToken()).success(function(response) {
         $scope.org = response;
	});
	 
});

