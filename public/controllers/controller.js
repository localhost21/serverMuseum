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

	
	
	

myApp.factory('accessFac', function($window) {
  var obj = {}
  obj.access = false;
  //obj.token = [];
  var i = 0;
  obj.image  = 'uploads/map-newCompany.png';
 
 
  obj.getImage = function(){
	  return obj.image;
  }
  
  obj.setImage = function(image){
	  obj.image = image;
  }
 
  obj.getPermission = function(helper) { //set the permission to true
    obj.access = true;
	
	 $window.localStorage['jwtToken'] = helper;
	//console.log("accessFac, getPerm " + obj.token[i]);
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


myApp.run(function($http, accessFac) {
    $http.get('/orgName/' + accessFac.getToken()).success(function(response) {
	 
	  var image = "uploads/map-" + response + ".png";
	  accessFac.setImage(image); 
	  console.log("image " + image);
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
	//console.log("loginCtrl token " + $scope.data.token);

	 
    if ($scope.data.status === "true") {
		//console.log($scope.answer.status);
		
		accessFac.getPermission($scope.data.token); //call the method in acccessFac to allow the user permission.
		$window.location.href = "/#/museumsverwaltung";
		$timeout(function(){
			
			//$window.location.reload(true);
		},100);

    } else {
      Alert.render("Falsche Zugangsdaten!");
    }}, 2000);
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

var refresh = function(){
	 $http.get('/museum/' + accessFac.getToken()).success(function(response) {
			$scope.datalicous = response;
			$scope.mn = "";						
			angular.forEach($scope.datalicous, function(mn) {
				$scope.id = mn._id;
				$scope.de = mn.de;
				$scope.en = mn.en;
				console.log(mn.en);
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

	$scope.image = accessFac.getImage();

  $http.get('/orgName/' + accessFac.getToken()).success(function(response) {
	  $scope.org = response;
	  $scope.logo = "uploads/logo-" + $scope.org + ".png";
  });  
  
  


	
	

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
          url: $scope.image,
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
    legend: {
      position: 'bottomright',
      colors: ['#1874cd'],
      labels: ['Exponatstandorte']
    },
    markers: $scope.markers = []
    
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
  
  
  
  
  
  $http.get('/markers/' + accessFac.getToken()).success(function(response) {
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
		//window.location.reload('custo');
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



myApp.controller('exponatCtrl', function($scope, $http, $location, $anchorScroll, $timeout, accessFac){
	
	$scope.top = function() {
      $location.hash('top');
      $anchorScroll();
    };
	
	var refresh = function() {
      //'/backend' is the route where the data is from
	  console.log(accessFac.getToken());
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
    $scope.remove = function(id) {
      $http.delete('/backend/' + id).success(function(response) {
        refresh();
      });
	  //window.location.reload('museumsverwaltung');
    }
    $scope.edit = function(id) {
      $http.get('/backendModify/' + id).success(function(response) {
        $scope.exponat = response;
        document.getElementById('hinzufügen').style = "display: none";
      });
    }
    $scope.update = function() {
      $http.put('/backend/' + $scope.exponat._id, $scope.exponat).success(function(response) {
        document.getElementById('hinzufügen').style = "display: inline-block";
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

