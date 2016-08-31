var express = require('express');
var multer  =   require('multer');
var app = express();
var bodyParser = require('body-parser');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + ".png");
  }
});
var upload = multer({ storage : storage}).fields([{
           name: 'map', maxCount: 1
         }, {
           name: 'logo', maxCount: 1
         }]);

var mongojs = require('mongojs');
var sha256 = require('js-sha256').sha256;
var databaseUrl = "mongodb://admin:admin@ds019816.mlab.com:19816/heroku_9ch385nb"; //db login heroku
//var databaseUrl = "login"; //login local
var collections = ['credentials'];
var db = mongojs(databaseUrl, ['credentials']);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	next();
})
app.get('/credentials/:id', function(req,res){	
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 	
	console.log("paramsid: "+req.params.id);
	var hashedValue= sha256(req.params.id);
	databaseUrl = "mongodb://admin:admin@ds019816.mlab.com:19816/heroku_9ch385nb";
	db = mongojs(databaseUrl, ['credentials']);
	
	db.credentials.find({"login": hashedValue}, function(err,doc){		
		if(err){
			
		}else if(doc != ""){	
			var helper = doc[0].org;
			console.log(helper);
			if(helper==="MoneyMuseum"){
				databaseUrl = "mongodb://admin:admin@ds019076.mlab.com:19076/heroku_bj4gkw7j" //MoneyMuseum
				//databaseUrl = "backend"; //--> local
				collections = ["backend", "markers", "museum","archive"]; //"credentials",
				db= mongojs(databaseUrl, collections);				
			}else if(helper==="newCompany"){
				databaseUrl = "mongodb://admin:admin@ds019076.mlab.com:19076/heroku_7gqs453c" //newCompany
				//databaseUrl = "newCompany"; //--> local
				collections = ["backend", "markers", "museum","archive"]; //"credentials",
				db= mongojs(databaseUrl, collections);
			}else{
				console.log("error at login");
			}			
		res.json("true");	
		}else{			
			res.json("false");
		}	
	});		
});

app.get('/login', function(req,res){	
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 	
	//databaseUrl = "login"; //local
	databaseUrl = "mongodb://admin:admin@ds019816.mlab.com:19816/heroku_9ch385nb"; //db login heroku
	db = mongojs(databaseUrl, ['credentials','avMuseums']);	
	db.avMuseums.find(function(err,doc){		
		res.json(doc);
	});		
});

app.get('/login/:id', function(req,res){	
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 	
	var name= req.params.id;
	//databaseUrl = "login"; //local
	databaseUrl = "mongodb://admin:admin@ds019816.mlab.com:19816/heroku_9ch385nb"; //db login heroku
	db = mongojs(databaseUrl, ['credentials']);
	 
	db.credentials.find({"org": name}, function(err,doc){		
		if(err){
			//todo: errorlog
		}else if(doc != ""){	
			console.log(name);
			if(name==="MoneyMuseum"){
				databaseUrl = "mongodb://admin:admin@ds019076.mlab.com:19076/heroku_bj4gkw7j"; //db MoneyMuseum
				//databaseUrl = "backend"; //--> local
				collections = ["backend", "markers", "museum","archive"]; //"credentials",
				db= mongojs(databaseUrl, collections);
			}else if(name==="newCompany"){
				databaseUrl = "mongodb://admin:admin@ds019076.mlab.com:19076/heroku_7gqs453c"; //db newCompany				
				//databaseUrl = "newCompany"; //--> local
				collections = ["backend", "markers", "museum","archive"]; //"credentials",
				db= mongojs(databaseUrl, collections);
			}else{
				console.log("error at login");
			}			
		res.json("true");	
		}else{			
			res.json("false");
		}	
	});		
});

//'/backend' is the route where the data is from
// server listens to get request
app.get('/backend', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.backend.find(function(err,docs){
		res.json(docs);	
	});
		
});

app.post('/backend', function(req,res){
	db.backend.insert(req.body,function(err,doc){
		res.json(doc);
	});
});

app.post('/markers', function(req,res){
	/*db.markers.insert(req.body,function(err,doc){
		res.json(doc);
	});*/
	
	var blup = req.body; 
	
	
	db.runCommand({
      insert: "markers",
      documents: [blup],
      ordered: false,
      writeConcern: { w: "majority", wtimeout: 5000 }
   })
	
	
	
});



app.post('/markersNew', function(req,res){
	db.markers.insert(req.body,function(err,doc){
		res.json(doc);
	});
	
});


app.get('/markers', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.markers.find(function(err,docs){
		res.json(docs);	
	});
		
});
/*
app.post('/museum', function(req,res){
	db.museum.remove();
	db.museum.insert(req.body,function(err,doc){
		res.json(doc);
	});
});*/


app.put('/museumDE/:id', function(req,res){
	var id= req.params.id;
	db.museum.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {de: req.body.de  }},
	nex: true}, function(err,doc){
		res.json(doc);
	});	
});

app.put('/museumEN/:id', function(req,res){
	var id= req.params.id;
	db.museum.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {en: req.body.en  }},
	nex: true}, function(err,doc){
		res.json(doc);
	});	
});


app.put('/museumName/:id', function(req,res){
	var id= req.params.id;
	db.museum.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {museumsname: req.body.museumsname  }},
	nex: true}, function(err,doc){
		res.json(doc);
	});		
	
});



app.get('/museum', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.museum.find(function(err,docs){
		res.json(docs);	
	});
		
});



app.delete('/markers', function(req, res){	
	db.markers.remove();
});



app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
		res.redirect('/#/custoConfirm');
        res.end("File is uploaded");
		
    });
});


app.post('/archiveMarkers',function(req,res){
	var date = new Date();
	var blup = JSON.stringify(req.body);
	db.runCommand({
      insert: "archive",
      documents: [{"name":"markers-" + date.toDateString(), blup}],
      ordered: false,
      writeConcern: { w: "majority", wtimeout: 5000 }
   })
	

	
});

app.get('/archiveMarkers',function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.archive.find(function(err,docs){
		var a = JSON.stringify(docs);
		res.json(JSON.parse(a));	
	});
});


app.get('/archiveMarkers/:id', function(req, res){
	var id = req.params.id;
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.archive.findOne({_id: mongojs.ObjectId(id)},
	function(err,doc){
		res.json(doc);
		});
	});	





app.get('/api/photo/logo', function(req,res){
	var helper = "/uploads/logo.png";
	res.json(helper);
})



app.get('/api/photo/map', function(req,res){
	var helper = "/uploads/map.png";
	res.json(helper);
})


app.get('/uploads/:id', function(req,res){
	var helper = req.params.id;
	res.json(helper);
})


app.delete('/backend/:id', function(req, res){
	var id = req.params.id;
	db.backend.remove({_id: mongojs.ObjectId(id)}, 
function(err,doc){
		res.json(doc);
	});
});

app.get('/backend/:id', function(req, res){
	var id = req.params.id;
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.backend.findOne({_id: mongojs.ObjectId(id)},
	function(err,doc){
		res.json(doc);
		});
	});
	
		
app.get('/backend:count', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.backend.count(function(err,docs){
		res.json(docs);	
	});
		
});

app.get('/deutsch', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.backend.find({"sprache": "DE", "aktion":true},
	function(err,doc){
		res.json(doc);
		});
});


app.get('/english', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.backend.find({"sprache": "EN","aktion":true},
	function(err,doc){
		res.json(doc);
		});
		
});

app.put('/backend/:id', function(req,res){
	var id= req.params.id;
	db.backend.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {ide: req.body.ide, bild: req.body.bild, name: req.body.name, position: req.body.position, theme: req.body.theme, audio: req.body.audio, aktion: req.body.aktion, sprache: req.body.sprache  }},
	nex: true}, function(err,doc){
		res.json(doc);
	});	
});

app.get('/getBeacons', function(req, res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://cloud.estimote.com/v2/devices", false );
	xmlHttp.setRequestHeader('Authorization', 'Basic YXVkaW9ndWlkZS0weHE6NWIzOTc5MzAzZTdhMWQ2YjY0MWUzMGQ2YTA1YWM0MmM=');
	xmlHttp.setRequestHeader('Accept', 'application/json');
    xmlHttp.send();	
	
	
	res.json(JSON.parse(xmlHttp.responseText));
});




app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
