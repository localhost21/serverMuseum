var myApp = angular.module('myApp', ['ngRoute', 'ui-leaflet','angularTrix', 'ui.bootstrap','app.routes', 'app.directives','xeditable']).config(function($sceDelegateProvider) {
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

//factories
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
  
  obj.setExponat = function(helper) { //set the permission to true
    obj.exponat = helper;	
  }
  obj.getExponat = function() {
	return obj.exponat;
    
  }
  
  
    obj.setBeacon = function(helper) { //set the permission to true
    obj.beacon = helper;	
  }
  obj.getBeacon = function() {
	return obj.beacon;
    
  }
   
  
  
  
  return obj;
});

myApp.run(function($http, accessFac, editableOptions){
	editableOptions.theme = 'bs3';
	
	$http.get('/museum/' + accessFac.getToken()).success(function(response) {
	 var museumData = response;
	 var museumH = "";						
	angular.forEach( museumData, function(museumH) {
		accessFac.setImage(museumH.map);
	});
  });  
});

//controllers
myApp.controller('PopupCont', function ($scope, $rootScope, $timeout, $uibModalInstance, $http, accessFac) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
	$http.get('/themenListe/' + accessFac.getToken()).success(function(response) {
		$scope.themaDaten = response;
		$scope.thema="";
	});
	
	$http.get('/nonWalkerMarkers/' + accessFac.getToken()).success(function(response) {
		$scope.maData = response;
		$scope.ma = "";
	});
	
	if(accessFac.getExponat()!=null){
		$scope.exponat = accessFac.getExponat();
	}else{
		$scope.exponat = "";
		$timeout(function(){
			document.getElementById('buttonAdd').style="display: inline-block";
			document.getElementById('buttonDelete').style="display: none";
			document.getElementById('buttonModify').style="display: none";
		},20);
		
	}
	
	$scope.de_expand=true;
	$scope.en_expand=false;
	
	
	$scope.remove = function(exponat) {
		$http.delete('/backend/' + exponat._id);
		$scope.close();		
        $rootScope.$emit("refresh", {});
    }
	
	
	$scope.addexponat = function(exponat) {
      if (3 > document.getElementById('ide').value.length) {
        window.alert("ID muss mindestens dreistellig sein");
      } else if(1 > document.getElementById('bildURL').value.length){
		  window.alert("Bitte geben Sie eine Bild-URL ein");
	  } else if(1 > document.getElementById('name_de').value.length){
		  window.alert("Bitte geben Sie einen Exponat-Namen ein");
	  } else {
		exponat = approval(exponat);
			
        $http.post('/backend/' + accessFac.getToken(), exponat).success(function(response) {
			 $rootScope.$emit("refresh", {});
			 $scope.close();
        });
      }
    }
	
	
	var approval = function(exponat){
		var a = exponat.bild;
		var b = exponat.audio_de;
		var c = exponat.audio_en;
		if(a!=null){
			exponat.bild = a.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}  
		if(b!=null){
			exponat.audio_de = b.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}
		if(c!=null){
			exponat.audio_en = c.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}
		console.log("done");
		return exponat;
	}
  
    $scope.update = function(exponat) {
		exponat = approval(exponat);
		
		
      $http.put('/backend/' + exponat._id, exponat).success(function(response) {
         $rootScope.$emit("refresh", {});
		 $scope.close();
      });
    }

});


myApp.controller('PopupContBeacon', function ($scope, $rootScope, $timeout, $uibModalInstance, $http, accessFac) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.beacon = accessFac.getBeacon();
	
	$scope.update = function(beacon) {
		$http.put('/setBeacons', beacon).success(function(response) {
			
		});
		$timeout(function(){
			//$rootScope.$emit("refresh", {});
			$scope.close();	
			window.alert("Erfolgreich gespeichert, Daten werden demnächst aktualisiert");
		},200);
	}
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





myApp.controller('custoCtrl', function($scope, $timeout, $location, $http, leafletData, leafletBoundsHelpers,shareClickedId,accessFac) {
	
	
	
	
	
	
	
$scope.resizeTextLeft = function(multiplier) {
  var elem = document.getElementsByClassName("fontChanger");
  for (i = 0; i < elem.length; i++) {
     var currentSize = elem[i].style.fontSize || 17;
	 var currentHeight = elem[i].style.lineHeight || 17;
     if (currentHeight != "26px") {
       elem[i].style.lineHeight = (parseFloat(currentHeight) + (multiplier * 3)) + "px";
       elem[i].style.fontSize = (parseFloat(currentSize) + (multiplier * 3.5)) + "px";
     } else if (currentHeight == "26px") {
       elem[i].style.lineHeight = (parseFloat(26) + "px");
       elem[i].style.fontSize = (parseFloat(26) + "px");
     } else {
       window.alert("error");
     }
   }
 
}

$scope.resizeTextRight = function(multiplier) {
  var elem = document.getElementsByClassName("fontChanger");
  for (i = 0; i < elem.length; i++) {
	var currentSize = elem[i].style.fontSize || 17;
	var currentHeight = elem[i].style.lineHeight || 17;
	if (currentHeight != "14px") {
		elem[i].style.lineHeight = (parseFloat(currentHeight) + (multiplier * 3)) + "px";
		elem[i].style.fontSize = (parseFloat(currentSize) + (multiplier * 3.5)) + "px";
	} else if (currentHeight == "14px") {
		elem[i].style.lineHeight = (parseFloat(14) + "px");
		elem[i].style.fontSize = (parseFloat(14) + "px");
	} else {
		window.alert("error");
	}
  }
}




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
				var helper = mn.de;
				helper = helper.replace(/<dib>/g, "<div class='fontChanger'>");
				helper = helper.replace(/<strong>/g, "<strong class='fontChanger'>");
				helper = helper.replace(/<em>/g, "<em class='fontChanger'>");				helper = helper.replace(/<dib>/g, "<div class='fontChanger'>");
				helper = helper.replace(/<figure>/g, "<figure class='fontChanger'>");
				helper = helper.replace(/<img>/g, "<img class='fontChanger'>");
				helper = helper.replace(/<ul>/g, "<ul class='fontChanger'>");
				helper = helper.replace(/<ol>/g, "<ol class='fontChanger'>");
				helper = helper.replace(/<li>/g, "<li class='fontChanger'>");
				helper = helper.replace(/<span>/g, "<span class='fontChanger'>");
				helper = helper.replace(/<del>/g, "<del class='fontChanger'>");
				helper = helper.replace(/<a>/g, "<a class='fontChanger'>");
				document.getElementById('helperInPhone').innerHTML = helper;
			});
			
			$scope.htmlcontent = $scope.de;
			
			document.getElementById('helper').innerHTML = $scope.htmlcontent;
			
			
			
			
			
			
			
      });
  $scope.clickedLng = "de";	
	 
  $scope.uploadText = function(hi) {
	  if($scope.clickedLng==="de"){
			$http.put('/museumDE/' + $scope.id, {"de":$scope.htmlcontent}).success(function(response) {refresh();});
		}else if($scope.clickedLng==="en"){
			$http.put('/museumEN/' + $scope.id, {"en":$scope.htmlcontent}).success(function(response) {refresh();});
		}		
    };
  
  
  $scope.uploadName = function(data) {		
		return $http.put('/museumName/' + $scope.id, {"museumsname":data}).success(function(response) {});
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
  
  $scope.addHoverPhone = function(ziel){
	  document.getElementById(ziel).style='color:orange';
	  document.getElementsByClassName(ziel).style='color:orange';
  }
  $scope.removeHoverPhone = function(ziel){
	  $timeout(function(){
		document.getElementById(ziel).style='color:black';
		document.getElementsByClassName(ziel).style='color:black';
	  }, 1500);
	  
  }

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

myApp.controller('beaconsCtrl', function($scope, $rootScope, $http, $uibModal, accessFac){
	
	
	$rootScope.$on("refresh", function(){		  
		  refresh();	
	  });
 
$scope.open = function ( helper) {
	console.log(helper);
	accessFac.setBeacon(helper);
	var modalInstance = $uibModal.open({
		templateUrl: 'www/popup_beacon.html',
		controller: 'PopupContBeacon',
		size: "lg"
	});
	
	modalInstance.result.then(
        //close
        function (result) {
            var a = result;
        },
        //dismiss
        function (result) {
            var a = result;
        });
}
		
	
	
	
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
};
refresh();	
});



myApp.controller('exponatCtrl', function($scope,$rootScope, $http, $uibModal, $location, $anchorScroll, $timeout, accessFac){

	$scope.open = function ( helper) {
		accessFac.setExponat(helper);
		var modalInstance = $uibModal.open({
			templateUrl: 'www/popup_exponat.html',
			controller: 'PopupCont',
			size: "lg"
	});
	
	modalInstance.result.then(
        //close
        function (result) {
            var a = result;
        },
        //dismiss
        function (result) {
            var a = result;
        });
}
	

	
	
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
  
  
	$rootScope.$on("refresh", function(){		  
	refresh();	
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
		  exponat.expand = true
		 try {
			var length = exponat.beschreibung_de.length;		  
		  }catch(e){}		  
		if(exponat.beschreibung_de===undefined){
				exponat.beschreibung_de="noch keine Beschreibung";
		}else if(length>40){
			   exponat.expand = false;
			   exponat.checkIfLong=true;				
		  }else if(length<=40){
			   exponat.checkIfLong = false;	
		  }
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
   

});



myApp.controller('orgCtrl',function($scope, $http, accessFac){
	$http.get('/orgName/' + accessFac.getToken()).success(function(response) {
         $scope.org = response;
	});
	 
});

