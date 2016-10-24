var myApp = angular.module('myApp', ['ngRoute','vcRecaptcha','pascalprecht.translate', 'angularTrix', 'ui.bootstrap','app.routes', 'app.directives','xeditable','ngSanitize','ui-leaflet']).config(function($sceDelegateProvider, $translateProvider) {
//'leaflet-directive', 'ui-leaflet'
  // deutsche Sprache
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  $translateProvider.translations('DE', {
	contact:		'Kontakt',
	loginText: 'Login Museumsverwaltung',
	Museumsverwaltung: 'Museumsverwaltung',
	exponate: 'Exponate',
	lokalisierung: 'Lokalisierung',
	hilfe: 'Hilfe',
	englisch: 'Englisch',
	german: 'Deutsch',
	anzExpo: 'Anzahl Exponate',
	expoText: 'Hier verwalten Sie Ihre Exponate.',
	newExpo: 'Neues Exponat',
	erwSuchOpt: ' erweiterte Suchoptionen anzeigen',
	suchOpt: 'Beschränken Sie die Suchergebnisse mit folgenden Filtern:',
	suchOptAus: 'erweiterte Suchoptionen ausblenden',
	exhNum: 'Exponat-Nr.',
	exhNumLong: 'Exponat-Nummer.',
	bild: 'Bild',
	theme: 'Thema',
	activ: 'Aktiv',
	toTop: 'zurück nach oben',
	angAls: ' angemeldet als',
	expVer: 'Exponat verwalten',
	expDesc: 'Beschreibung',
	audioUrl: 'Audiofile- URL',
	imgUrl: 'Bild- URL',
	themeNr: 'Themen- Nummer',
	deletee: 'Löschen',
	hinzu: 'Hinzufügen',
	abbr: 'Abbrechen',
	verbergen: 'verbergen',
	anzeigen: 'anzeigen',
	sendestarke: 'Sendestärke',
	interval: 'Sendeintervall',
	battery: 'Batterielaufzeit in Tagen',
	color: 'Farbe',
	alle: 'alle',
	milisek: 'Milisekunden',
	beschr: '(zwischen 100 und 10\'000)',
	change: 'Ändern',
	countB: 'Anzahl Beacons',
	descB: 'Hier können Sie die Einstellungen Ihrer Beacons ändern oder',
	descBe: 'weitere Beacons bestellen.',
	name: 'Name',
	major: 'Major',
	minor: 'Minor',
	sendeinterval: 'Interval in ms',
	custoDesc: 'Hier können Sie den Audioguide Ihren Bedürfnissen nach anpassen.',
	allgAng: 'Allgemeine Angaben',
	aboutUs: 'Passen Sie den Namen und den \"Über uns\"- Text an',
	ueberUns: 'Über uns',
	welcome: 'Herzlich Willkommen im',
	themeg: 'Themengebiete',
	themegn: 'Themennummer (dreistellig) ',
	newOne: 'Neu hinzufügen',
	map: 'Karte',
	erkl:'Fahren Sie mit der Maustaste über die einzelnen Positionen um den aktuellen Standort auf der Karte anzuzeigen',
	bemanu: 'Beacon Major Nummer',
	deletemarkers: 'Alle Standorte löschen',
	archive: 'Standorte Archivieren',
	getarchive: 'archivierte Standorte',
	speichern: 'Speichern',
	beaconsVer: 'Beacons verwalten',
	position: 'Position',
	singup: 'Registrieren',
	firm: 'Name des Museums',
	anspPers: 'Name Ansprechperson',
	emailAns: 'E-Mail Addresse',
	telAns: 'Telefon',
	username: 'Username',
	pw: 'Passwort',
	pwR: 'Passwort wiederholen',
	einstl: 'Kontaktinformationen',
	keineExponate: 'Sie haben noch keine Exponate erfasst.',
	keineBeacons: 'Sie haben noch keine Beacons bestellt.',
	registiert: 'Erfolgreich registriert!',
	musNameVorTitel: 'Name bereits erfasst',
	musNameVor: 'Der gewählte Museumsname wurde bereits erfasst. Falls du dein Passwort vergessen hast, kontaktiere uns bitte.',
	usernameVorTitel: 'Username bereits vorhanden',
	usernameVor: 'Der gewählte Username wurde bereits erfasst. Falls du dein Passwort vergessen hast, kontaktiere uns bitte.',
	fehlerTitel: 'Anmeldung prüfen',
	fehlerText: 'Falsche zugangsdaten eingegeben!'
	
	
	
 });

  // englische Sprache
  $translateProvider.translations('EN', {
	musNameVorTitel: 'Name already exists',
	fehlerTitel: 'Sign in failed',
	fehlerText: 'You have entered the wrong credentials!',
	musNameVor: 'The name of your museum already exists. If you forgot your password, please contact us.',
	usernameVorTitel: 'User already exists',
	usernameVor: 'The user already exists. If you forgot your password, please contact us.',
	username: 'Username',
	pw: 'Password',
	pwR: 'Repeat Password',
	einstl: 'Contact Information',
	keineExponate: 'You haven\'t added any exhibits yet.',
	keineBeacons: 'You haven\'t ordered any beacons yet.',
	registiert: 'Successfully registered!',
	deletemarkers: 'delete all markers',
	archive: 'archive markers',
	getarchive: 'archived postions',
	speichern: 'save',	
	beaconsVer: 'Manage Beacons',  
	position: 'position',
	singup: 'sign up',
	firm: 'Museum Name',
	anspPers: 'Name of a contact person',
	emailAns: 'E-Mail',  
	telAns: 'Phone', 
	allgAng: 'General information',
	aboutUs: 'Change the name of your museum and the about us section',
	ueberUns: 'About us',
	welcome: 'Welcome to the',
	themeg: 'exhibitions',
	themegn: 'Theme number (three digits)',
	newOne: 'add new',
	map: 'map',
	erkl: 'hover the cursor over the positions to show them on the map',
	bemanu: 'beacon major number',	  
	custoDesc: 'Here you can modify the content of the app.',
	interval: 'interval',
	battery: 'remaining batterylifetime in days',
	color: 'color',
	alle: 'all',
	milisek: 'miliseconds',
	beschr: '(between 100 and 10\'000)',
	change: 'change',
	descB: 'Here you can change the settings of your beacons or',
	countB: 'Number of beacons',
	descBe: 'order more Beacons.',
	name: 'Name',
	major: 'Major',
	minor: 'Minor',
	sendeinterval: 'Interval in ms',	
	sendestarke: 'Range',
	verbergen: 'hide',
	anzeigen: 'show',
	abbr: 'quit',
	hinzu: 'save',
	deletee: 'delete',
	themeNr: 'Theme- Number',
	imgUrl: 'Image- URL',
	audioUrl: 'Audiofile- URL',
	expDesc: 'Description',
	expVer: 'Manage exhibit',
    contact:		'Contact us',
	loginText: 'Login Museum',
	Museumsverwaltung: 'Museum',
	exponate: 'Exhibits',
	lokalisierung: 'Localization',
	hilfe: 'Help',
	englisch: 'english',
	german: 'german',
	anzExpo: 'number of exhibits',
	expoText: 'Manage your exhibits',
	newExpo: 'new exhibit',
	erwSuchOpt: ' more filters',
	suchOpt: 'choose of the following filters',
	suchOptAus: 'less filters',
	exhNum: 'Exhibition-ID',
	exhNumLong: 'Exhibit Number',
	bild: 'Image',
	theme: 'Theme',
	activ: 'Activ',
	toTop: 'to top',
	angAls: 'logged in as'
	
  });

  $translateProvider.preferredLanguage('DE');
 
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
    'https://cloud.estimote.com/**',
	'http://res.cloudinary.com/**'
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
  obj.lng = "DE"
   $window.localStorage['map'] = 'https://dl.dropboxusercontent.com/s/x180clbggcug3ta/loading-circle.gif?dl=0';

 
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
  
  obj.setLng = function(helper) { //set the permission to true
    obj.lng = helper;	
  }
  obj.getLng = function() {
	return obj.lng;
    
  }
   
  
  
  
  return obj;
});








myApp.service('fehlermeldungFac', ['$uibModal', function ($uibModal) {

    var openCustomModal = function () {
			

        var modalInstance = $uibModal.open({
			templateUrl: 'www/popup_nonReg.html',
			controller: 'popupNonReg'
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
		window.location="/#/";
		
    };

    return {
        openCustomModal: openCustomModal
    };
}]);



myApp.run(function($http, accessFac, editableOptions){
	editableOptions.theme = 'bs3';
});

//controllers
myApp.controller('popupNonReg', function ($scope, $uibModalInstance) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};

});

myApp.controller('LangCtrl', function ($scope, $http, $translate,$rootScope, accessFac) {

  $scope.showLng = false;

  
  
  	$http.get('/getHashTrue/' + accessFac.getToken()).success(function(response) {
		  $scope.showDashboard = response;
	});
	
  
  $scope.changeLang = function (key) {
    $translate.use(key).then(function (key) {
	  accessFac.setLng(key);
	  $rootScope.$emit("changeLng", {key});
    }, function (key) {
      console.log("Irgendwas lief schief.");
    });
  };
});


myApp.controller('languagesCtrl', function ($scope, $http, $translate,$rootScope, accessFac) {
  $scope.changeLang = function (key) {
    $translate.use(key).then(function (key) {
	  accessFac.setLng(key);
	  $rootScope.$emit("changeLng", {key});
    }, function (key) {
      console.log("Irgendwas lief schief.");
    });
  };
});



myApp.controller('dashboardCtrl', function($scope, $http, accessFac){
	$http.get('/getLogin/' + accessFac.getToken()).success(function(response) {
		$scope.users = response;
		$scope.user="";
	});	
});

myApp.controller('PopupCont', function ($scope, $rootScope,$uibModal, $timeout, $uibModalInstance, $http, accessFac) {
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
	
	$scope.openModal = function(titel, text){
		var modalInstance = $uibModal.open({
			template: "<div class= \"modal-header\" style=\"background-color: #1c567d;\"><h3 class=\"modal-title\" style=\"color: white; text-align: center; display:inline-block;\">{{'"+titel+"'|translate}}</h3><a class=\"fa fa-close fa-2x\" ng-click=\"close()\" style=\"float:right; display: inline-block; color: white;\"></a></div><div class=\"modal-body\" style=\"background-color: #f2f2f2;\"><p>{{'"+text+"'|translate}}</p></div>",
			controller: 'regCtrl',
			size: "sm"
		});
	}
	
	$scope.addexponat = function(exponat) {
      if (3 > document.getElementById('ide').value.length) {
		$scope.openModal('Hinweis',"ID muss mindestens dreistellig sein" );
      } else if(1 > document.getElementById('bildURL').value.length){
		 $scope.openModal('Hinweis',"Bitte geben Sie eine Bild URL ein" );
	  } else if(1 > document.getElementById('name_de').value.length){
		   $scope.openModal('Hinweis',"Bitte geben Sie einen Exponat-Namen ein" );
	  } else {
			
        $http.post('/backend/' + accessFac.getToken(), exponat).success(function(response) {
			 $rootScope.$emit("refresh", {});
			 $scope.close();
        });
      }
    }

	
	$scope.removDb = function(){
		var a = $scope.exponat.bild;
		var b = $scope.exponat.audio_de;
		var c = $scope.exponat.audio_en;
		if(a!=null){
			$scope.exponat.bild = a.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}  
		if(b!=null){
			$scope.exponat.audio_de = b.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}
		if(c!=null){
			$scope.exponat.audio_en = c.replace(/www.dropbox/g, "dl.dropboxusercontent");
		}
	}
	
	
	
	
	
	
	
	
  
    $scope.update = function(exponat) {
	  $http.put('/backend/' + exponat._id, exponat).success(function(response) {
         $rootScope.$emit("refresh", {});
		 $scope.close();
      });
    }

});


myApp.controller('PopupContBeacon', function ($scope, $rootScope, $timeout, $uibModalInstance,$uibModal, $http, accessFac) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.beacon = accessFac.getBeacon();
	$scope.openModal = function(titel, text){
		var modalInstance = $uibModal.open({
			template: "<div class= \"modal-header\" style=\"background-color: #1c567d;\"><h3 class=\"modal-title\" style=\"color: white; text-align: center; display:inline-block;\">{{'"+titel+"'|translate}}</h3><a class=\"fa fa-close fa-2x\" ng-click=\"close()\" style=\"float:right; display: inline-block; color: white;\"></a></div><div class=\"modal-body\" style=\"background-color: #f2f2f2;\"><p>{{'"+text+"'|translate}}</p></div>",
			controller: 'regCtrl',
			size: "sm"
		});
	}
	
	$scope.update = function(beacon) {
		$http.put('/setBeacons', beacon).success(function(response) {
			
		});
		$timeout(function(){
			//$rootScope.$emit("refresh", {});
			$scope.close();	
			
			$scope.openModal("Hinweis","Erfolgreich gespeichert, Daten werden demnächst aktualisiert")
		},200);
	}
});


myApp.controller('regCtrl', function ($scope, $timeout,$rootScope, $uibModalInstance, $uibModal, $http, accessFac, vcRecaptchaService) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};

	
	$scope.showLoader = false;  
	
	$scope.openModal = function(titel, text){
		var modalInstance = $uibModal.open({
			template: "<div class= \"modal-header\" style=\"background-color: #1c567d;\"><h3 class=\"modal-title\" style=\"color: white; text-align: center; display:inline-block;\">{{'"+titel+"'|translate}}</h3><a class=\"fa fa-close fa-2x\" ng-click=\"close()\" style=\"float:right; display: inline-block; color: white;\"></a></div><div class=\"modal-body\" style=\"background-color: #f2f2f2;\"><p>{{'"+text+"'|translate}}</p></div>",
			controller: 'regCtrl',
			size: "sm"
		});
	}
	
	
	$scope.register = '';
	
	$scope.speichern= function(){
		$scope.showLoader = true;
		$timeout(function(){
		$scope.showLoader = false;
		 if(vcRecaptchaService.getResponse() === ""|| vcRecaptchaService.getResponse() == null){ //if string is empty
                $scope.openModal('recaptch','Please resolve the captcha and submit!');
				
          }else{
		$scope.register.recaptcha = vcRecaptchaService.getResponse()
		
		

		if($scope.register.pw!=$scope.register.pwR){
			$scope.openModal('Hinweis','Passwörter stimmen nicht überein. Vergewissern Sie sich, dass die beiden Passwörter identisch sind.')
		}else if($scope.register.pw==null){			
				$scope.openModal('Hinweis','Bitte Passwort eingeben');			
		}else if($scope.register.name==null){			
				$scope.openModal('Hinweis','Bitte Museumsname eingeben');			
		}else if($scope.register.username==null){			
				$scope.openModal('Hinweis','Bitte Username eingeben');			
		}else if($scope.register.pw.length<8){
				$scope.openModal('Hinweis','Passwort muss mindestens 8 Zeichen enthalten');
		} else{	
			$scope.register.creds = $scope.register.username +":" + $scope.register.pw;
			$http.post('/register', $scope.register).success(function(response) {
				if(response.login== null && response.nameExists==null){
					$scope.close();
					$rootScope.$emit("showAlert");
				}
				if(response.login!=null) {
					$scope.showLoader = false;
					$scope.openModal('usernameVorTitel','usernameVor')
				}
				if(response.nameExists!=null) {
					$scope.showLoader = false;
					$scope.openModal('musNameVorTitel','musNameVor')
				}
			});	
			
		}
}
	
	}, 500);
	}
		
	
	
});

myApp.controller('loginCtrl', function($scope, $http, $timeout,$rootScope, $location, $window, $uibModal, accessFac) {
   var gifSource = $('#gif').attr('src'); //get the source in the var
    $('#gif').attr('src', ""); //erase the source     
    $('#gif').attr('src', gifSource+"?"+new Date().getTime());
	
	$scope.myFunct = function(keyEvent) {
		if (keyEvent.which === 13)
			$scope.getAccess();
	}

	$scope.showAlert= false;
	$scope.showLoader = false;
	
	$scope.openModal = function(titel, text){
		var modalInstance = $uibModal.open({
			template: "<div class= \"modal-header\" style=\"background-color: #1c567d;\"><h3 class=\"modal-title\" style=\"color: white; text-align: center; display:inline-block;\">{{'"+titel+"'|translate}}</h3><a class=\"fa fa-close fa-2x\" ng-click=\"close()\" style=\"float:right; display: inline-block; color: white;\"></a></div><div class=\"modal-body\" style=\"background-color: #f2f2f2;\"><p>{{'"+text+"'|translate}}</p></div>",
			controller: 'regCtrl',
			size: "sm"
		});
	}
	
	$rootScope.$on("showAlert", function(){		  
		$scope.showAlert=true;
		$timeout(function(){
			$scope.showAlert=false;
		}, 3500);
	});
	
	
	$scope.register = function ( helper) {
		accessFac.setExponat(helper);
		var modalInstance = $uibModal.open({
			templateUrl: 'www/popup_reg.html',
			controller: 'regCtrl',
			size: "lg"
	});
	
	}
	
  $scope.getAccess = function() {
	
	$scope.showLoader = true;  
	var creds = $scope.username +":" + $scope.password;
	
	$http.get('/credentials/' + creds, {
  }).success(function(response) {
	  $scope.data = response;

  });
  
  		
	$timeout(function(){
	 
    if ($scope.data.status === "true") {		
		accessFac.getPermission($scope.data.token); //call the method in acccessFac to allow the user permission.
		$window.location.href = "/#/museumsverwaltung";

    } else {
		$scope.openModal('fehlerTitel','fehlerText');
		$scope.showLoader = false; 
    }}, 2000);
  }
  
  
  
  
  

});





myApp.controller('custoCtrl', function($scope, $interval, $rootScope, $timeout, $location, $http, leafletData, leafletBoundsHelpers,shareClickedId,accessFac) {
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
  
  
  
  $http.get('/register/' + accessFac.getToken()).success(function(response) {
    $scope.register = response;
	angular.forEach($scope.register, function(register) {
		$scope.org = register.org;
		$scope.contactPerson = register.contactPerson;
		$scope.contactPersonTel = register.tel;
		$scope.contactPersonMail = register.mail;
	});
	
	
  });
  
  
  
  $scope.uploadName = function(data) {		
		return $http.put('/museumName/' + $scope.org, {"museumsname":data});
    } 
  
  $scope.uploadContact = function(data){
	 return $http.put('/registerContact/' + $scope.org, {"contactPerson":data});
  }
  
  $scope.uploadMail = function(data){
	 return $http.put('/registerMail/' + $scope.org, {"mail":data});
  }
  
  $scope.uploadTel = function(data){
	 return $http.put('/registerTel/' + $scope.org, {"tel":data});
  }

		  
  
	$scope.showText = true;
	
	$scope.lng= accessFac.getLng();
	
	$rootScope.$on("changeLng", function(){		  
		$scope.changeLng();	
	});
	
	$scope.changeLng = function(){
		$scope.lng= accessFac.getLng();
	}
	
	
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
				helper = helper.replace(/<div>/g, "<div class='fontChanger'>");
				helper = helper.replace(/<strong>/g, "<strong class='fontChanger'>");
				helper = helper.replace(/<em>/g, "<em class='fontChanger'>");				
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
		  doRefresh: false,
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
 var refreshIntervalInSeconds = 30;
 var actualSeconds = 0;
 $interval(function() {
     if (actualSeconds === refreshIntervalInSeconds) {		 
         $scope.layers.baselayers.Gesamtansicht.url = accessFac.getImage();
         $scope.layers.baselayers.Gesamtansicht.doRefresh = true;
     
         actualSeconds = 0;
     } else {
         actualSeconds += 1;
     }
 }, 50);
  
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
	
	$scope.keineBeacons = false;
	$scope.showLoader = true;
	
	$rootScope.$on("refresh", function(){		  
		  refresh();	
	  });
 
$scope.open = function ( helper) {
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
	$http.get('/getBeacons/' + accessFac.getToken()).success(function(response) {
	  $scope.showLoader=false;
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
	  if($scope.i==0)
		  $scope.keineBeacons=true;
	  
	  
	  
    });	
};
refresh();	
});



myApp.controller('exponatCtrl', function($scope,$rootScope,$window, $http, $uibModal, $location, $anchorScroll, $timeout, accessFac){
	$scope.lng= accessFac.getLng();
	$scope.keineExponate = false;
	
	
	var refresh = function() {
      $http.get('/backend/'+ $window.localStorage['jwtToken']).success(function(response) {
        $scope.backend = response;
        $scope.exponat = "";
        $scope.sortType = 'ide';
        $scope.sortReverse = false;
        $scope.searchName = '';			
        angular.forEach($scope.backend, function(exponat) {
          exponat.ide = parseFloat(exponat.ide);
		  exponat.expand = true;
		  exponat.expandEn = true;
	
		 try {
			var lengthDE = exponat.beschreibung_de.length;		  
			var lengthEN = exponat.beschreibung_en.length;		  
		  }catch(e){}		  
		if(exponat.beschreibung_de===undefined){
				exponat.beschreibung_de="noch keine Beschreibung";
		}
		if(exponat.beschreibung_en===undefined){
				exponat.beschreibung_en="no description yet";
		}
		
		if(lengthDE>40){
			   exponat.expand = false;
			   exponat.checkIfLong=true;				
		}else if(lengthDE<=40){
			   exponat.checkIfLong = false;	
		}
		
		if(lengthEN>40){
			   exponat.expandEn = false;
			   exponat.checkIfLongEn=true;				
		  }else if(lengthEN<=40){
			   exponat.checkIfLongEn = false;	
		}
		});

      });
	  
	  $http.get('/backend_count/'+accessFac.getToken()).success(function(response) {
		  $scope.number = response;
		  if($scope.number==0)
			$scope.keineExponate = true
      });
    }
	refresh();
	
	$rootScope.$on("changeLng", function(){		  
		$scope.changeLng();	
	});
	
	$scope.changeLng = function(){
		$scope.lng= accessFac.getLng();
	}
	
	
	$scope.showErweiterteSuche = true;
	
	
	$scope.open = function (helper) {
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
 
 
 

	
	$http.get('/themenListe/' + accessFac.getToken()).success(function(response) {
		$scope.themaDaten = response;
		$scope.thema="";
	});
   

});



myApp.controller('orgCtrl',function($scope, $http,$window, accessFac){
	$http.get('/orgName/' + accessFac.getToken()).success(function(response) {
         $scope.org = response;
	});
	
	$scope.logout = function(){
		 $window.localStorage['jwtToken'] = "";
	}
	 
});

