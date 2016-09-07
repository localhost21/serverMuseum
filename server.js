var express = require('express');
var multer  =   require('multer');
var app = express();
var bodyParser = require('body-parser');

var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/'});
var fs = require('fs');
var type = upload.single('recfile');


var mongojs = require('mongojs');
var sha256 = require('js-sha256').sha256;


var databaseUrl = "mongodb://admin:admin@ds019076.mlab.com:19076/heroku_bj4gkw7j";
//var databaseUrl = "allDB";
var collections = ["credentials", "backend", "markers", "museum","archive"];

var morgan      = require('morgan');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//var databaseUrl = "login"; //login local
//var collections = ["credentials"];
var db = mongojs(databaseUrl, collections);

var apiRoutes = express.Router(); 





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
	var hashedValue= sha256(req.params.id);
	//databaseUrl = "mongodb://admin:admin@ds019816.mlab.com:19816/heroku_9ch385nb";
	//db = mongojs(databaseUrl, ['credentials']);
	
	db.credentials.find({"login": hashedValue}, function(err,doc){		
		if(err){
			console.log("error - no entries found")
		}else if(doc != ""){	
			var helper = doc[0].org;
			var token = jwt.sign(doc[0], helper, {
				expiresIn : 60*60
			});			
			res.json({
				"status":"true", 
				"token": token
			});			
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
	//databaseUrl = "mongodb://admin:admin@ds019816.mlab.com:19816/heroku_9ch385nb"; //db login heroku
	//db = mongojs(databaseUrl, ['credentials','avMuseums']);	
	db.museum.find(function(err,doc){		
		res.json(doc);
	});		
});

app.get('/login/:id', function(req,res){	
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	var org = req.params.id;
	db.museum.find({"org": org}, function(err,doc){		
		if(err){
			console.log("error - no entries found")
		}else if(doc != ""){	
			var token = jwt.sign(doc[0], org, {
				expiresIn : 60*60
			});			
			res.json({ 
				"token": token
			});			
		}else{			
			res.json("false");
		}	
	});		

});


//'/backend' is the route where the data is from
// server listens to get request
app.get('/backend/:id', function(req,res){
	var token = req.params.id;
if(token===""){
		response.writeHead(302);
	response.end();

}else{
	
	db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {
try{
	var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
		
		decode = decode.org;
		}catch(error){
			console.log("error");
		}
       
	  if (decode === org[i].org) {		 
          db.backend.find({
            org: decode
          }, function(err, docs) {
            res.json(docs);
			
          });
		  break;
        }
      }	  
    });
	}, 100);
  });	


}	


});




app.post('/backend/:id', function(req,res){
	var token = req.params.id;
		if (token === "") {
		  response.writeHead(302);
		  response.end();
		} else {
		  db.credentials.count(function(err, docs) {
		    var count = docs;
		    setTimeout(function() {
		      db.credentials.find({
		        "org": {
		          $ne: null
		        }
		      }, function(err, doc) {
		        var org = [];
		        org = doc;

		        //setTimeout(function() {},2);
		        for (i = 0; i < count; i++) {
		          try {
		            var decode = jwt.decode(token, org[i].org, function(err_, decode) {
		              if (err) {
		                return console.error(err.name, err.message);
		              }
		            });
		            decode = decode.org;
		          } catch (error) {
		            console.log("error");
		          }
		          if (decode === org[i].org) {
		            var request = JSON.stringify(req.body);
		            var h = ',"org":"' + decode + '"}';
		            var helper = request.replace("}", h);
		            db.backend.insert(JSON.parse(helper), function(err, doc) {
		              res.json(doc);
		            });

		            //
		            break;
		          }
		        }
		      });
		    }, 100);
		  });
		}
});

app.post('/markers/:id', function(req,res){
var token = req.params.id;
		if (token === "") {
		  response.writeHead(302);
		  response.end();
		} else {
		  db.credentials.count(function(err, docs) {
		    var count = docs;
		    setTimeout(function() {
		      db.credentials.find({
		        "org": {
		          $ne: null
		        }
		      }, function(err, doc) {
		        var org = [];
		        org = doc;

		        //setTimeout(function() {},2);
		        for (i = 0; i < count; i++) {
		          try {
		            var decode = jwt.decode(token, org[i].org, function(err_, decode) {
		              if (err) {
		                return console.error(err.name, err.message);
		              }
		            });
		            decode = decode.org;
		          } catch (error) {
		            console.log("error");
		          }
		          if (decode === org[i].org) {
		            var request = JSON.stringify(req.body);
		            var h = ',"org":"' + decode + '"}';
		            var blup = request.replace("}", h);
		            db.runCommand({
      insert: "markers",
      documents: [JSON.parse(blup)],
      ordered: false,
      writeConcern: { w: "majority", wtimeout: 5000 }
   })

		            //
		            break;
		          }
		        }
		      });
		    }, 100);
		  });
		}	
});



app.post('/markersNew/:id', function(req,res){
	var token = req.params.id;
		if (token === "") {
		  response.writeHead(302);
		  response.end();
		} else {
		  db.credentials.count(function(err, docs) {
		    var count = docs;
		    setTimeout(function() {
		      db.credentials.find({
		        "org": {
		          $ne: null
		        }
		      }, function(err, doc) {
		        var org = [];
		        org = doc;

		        //setTimeout(function() {},2);
		        for (i = 0; i < count; i++) {
		          try {
		            var decode = jwt.decode(token, org[i].org, function(err_, decode) {
		              if (err) {
		                return console.error(err.name, err.message);
		              }
		            });
		            decode = decode.org;
		          } catch (error) {
		            console.log("error");
		          }
		          if (decode === org[i].org) {
		            var request = JSON.stringify(req.body);
		            var h = ',"org":"' + decode + '"}';
		            var helper = request.replace("}", h);
		            db.markers.insert(JSON.parse(helper), function(err, doc) {
		              res.json(doc);
		            });

		            //
		            break;
		          }
		        }
		      });
		    }, 100);
		  });
		}
	
});


app.get('/markers/:id', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	var token = req.params.id;
if(token===""){
		response.writeHead(302);
	response.end();

}else{
	
	db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {
try{
	var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
		
		decode = decode.org;
		}catch(error){
			console.log("error");
		}
       
	  if (decode === org[i].org) {		 
          db.markers.find({
            org: decode
          }, function(err, docs) {
            res.json(docs);
			
          });
		  break;
        }
      }	  
    });
	}, 100);
  });	


}	
	
		
});



app.put('/museumDE/:id', function(req,res){
	var id= req.params.id;
	db.museum.findAndModify({query: {_id: id},
		update: {$set: {de: req.body.de  }},
	nex: true}, function(err,doc){
		res.json(doc);
	});	
});

app.put('/museumEN/:id', function(req,res){
	var id= req.params.id;
	db.museum.findAndModify({query: {_id: id},
		update: {$set: {en: req.body.en  }},
	nex: true}, function(err,doc){
		res.json(doc);
	});	
});


app.put('/museumName/:id', function(req,res){
	var id= req.params.id;
	db.museum.findAndModify({query: {_id: id},
		update: {$set: {museumsname: req.body.museumsname  }},
	nex: true}, function(err,doc){
		res.json(doc);
	});		
	
});



app.get('/museum/:id', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	var token = req.params.id;
if(token===""){
	response.writeHead(302);
	response.end();

}else{
	
	db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {
try{
	var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
		
		decode = decode.org;
		
	  if (decode === org[i].org) {		 
          db.museum.find({
            org: decode
          }, function(err, docs) {
            res.json(docs);
			
          });
		  break;
        }
		}catch(error){
			console.log("error@/museum");
		}
      }	  
    });
	}, 100);
  });	


}	
		
});



app.delete('/markers/:id', function(req, res){	
	 var token = req.params.id;
      if (token === "") {
       
      } else {
        db.credentials.count(function(err, docs) {
          var count = docs;
          setTimeout(function() {
            db.credentials.find({
              "org": {
                $ne: null
              }
            }, function(err, doc) {
              var org = [];
              org = doc;
              for (i = 0; i < count; i++) {
                try {
                  var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                    if (err) {
                      return console.error(err.name, err.message);
                    }
                  });
                  decode = decode.org;
                  if (decode === org[i].org) {
                    db.markers.remove({"org":decode});
                    break;
                  }
                } catch (error) {
                  console.log("error@/museum");
                }
              }
            });
          }, 100);
        });
      }	
});



app.post('/api/photo/logo/:id', type, function(req, res) {
      var token = req.params.id;
      var tmp_path = req.file.path;
      if (token === "") {
        response.writeHead(302);
        response.end();
      } else {
        db.credentials.count(function(err, docs) {
          var count = docs;
          setTimeout(function() {
            db.credentials.find({
              "org": {
                $ne: null
              }
            }, function(err, doc) {
              var org = [];
              org = doc;
              for (i = 0; i < count; i++) {
                try {
                  var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                    if (err) {
                      return console.error(err.name, err.message);
                    }
                  });
                  decode = decode.org;
                  if (decode === org[i].org) {
                    var target_path = 'public/uploads/logo-' + org[i].org + '.png'; 
                    var src = fs.createReadStream(tmp_path);
                    var dest = fs.createWriteStream(target_path);
                    src.pipe(dest);
                    res.redirect('/#/custo');
                    fs.unlink(tmp_path);
                    break;
                  }
                } catch (error) {
                  console.log("error@/museum");
                }
              }
            });
          }, 100);
        });
      }
});



app.post('/api/photo/map/:id', type, function(req, res) {
      var token = req.params.id;
      var tmp_path = req.file.path;
      if (token === "") {
        response.writeHead(302);
        response.end();
      } else {
        db.credentials.count(function(err, docs) {
          var count = docs;
          setTimeout(function() {
            db.credentials.find({
              "org": {
                $ne: null
              }
            }, function(err, doc) {
              var org = [];
              org = doc;
              for (i = 0; i < count; i++) {
                try {
                  var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                    if (err) {
                      return console.error(err.name, err.message);
                    }
                  });
                  decode = decode.org;
                  if (decode === org[i].org) {
                    var target_path = 'public/uploads/map-' + org[i].org + '.png'; 
                    var src = fs.createReadStream(tmp_path);
                    var dest = fs.createWriteStream(target_path);
                    src.pipe(dest);
                    res.redirect('/#/custo');
                    fs.unlink(tmp_path);
                    break;
                  }
                } catch (error) {
                  console.log("error@/museum");
                }
              }
            });
          }, 100);
        });
      }
});






app.post('/archiveMarkers/:id',function(req,res){
	 var token = req.params.id;
      if (token === "") {
       
      } else {
        db.credentials.count(function(err, docs) {
          var count = docs;
          setTimeout(function() {
            db.credentials.find({
              "org": {
                $ne: null
              }
            }, function(err, doc) {
              var org = [];
              org = doc;
              for (i = 0; i < count; i++) {
                try {
                  var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                    if (err) {
                      return console.error(err.name, err.message);
                    }
                  });
                  decode = decode.org;
                  if (decode === org[i].org) {
                    var date = new Date();
					var blup = JSON.stringify(req.body);
					db.runCommand({
						insert: "archive",
						documents: [{"name":"markers-" + date.toDateString(),"org":decode, blup}],
						ordered: false,
						writeConcern: { w: "majority", wtimeout: 5000 }
					})
	
                    break;
                  }
                } catch (error) {
                  console.log("error@/museum");
                }
              }
            });
          }, 100);
        });
      }	
});

app.get('/archived/:id',function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	var token = req.params.id;
      if (token === "") {
       
      } else {
        db.credentials.count(function(err, docs) {
          var count = docs;
          setTimeout(function() {
            db.credentials.find({
              "org": {
                $ne: null
              }
            }, function(err, doc) {
              var org = [];
              org = doc;
              for (i = 0; i < count; i++) {
                try {
                  var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                    if (err) {
                      return console.error(err.name, err.message);
                    }
                  });
                  decode = decode.org;
                  if (decode === org[i].org) {
                    db.archive.find({"org":decode}, function(err,docs){
		var a = JSON.stringify(docs);
		res.json(JSON.parse(a));	
	});
	
                    break;
                  }
                } catch (error) {
                  console.log("error@/museum");
                }
              }
            });
          }, 100);
        });
      }	
	
	
	
	
	
	
});


app.get('/archiveMarkers/:id', function(req, res){
	var id = req.params.id;
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.archive.findOne({_id: id},
	function(err,doc){
		res.json(doc);
		});
	});	





app.get('/orgName/:id', function(req,res){
	var token = req.params.id;
if(token===""){
		response.writeHead(302);
	response.end();

}else{
	
	db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {
try{
	var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
		
		decode = decode.org;
		
       
	  if (decode === org[i].org) {	
		res.json(org[i].org);
		break; 
    };
	}catch(error){
			console.log("error");
		}
	  };
	});
}, 100);
  });	


}	
	
})
app.get('/api/photo/logo/:id',  function(req, res) {
      var token = req.params.id;
     
      if (token === "") {
        response.writeHead(302);
        response.end();
      } else {
        db.credentials.count(function(err, docs) {
          var count = docs;
          setTimeout(function() {
            db.credentials.find({
              "org": {
                $ne: null
              }
            }, function(err, doc) {
              var org = [];
              org = doc;
              for (i = 0; i < count; i++) {
                try {
                  var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                    if (err) {
                      return console.error(err.name, err.message);
                    }
                  });
                  decode = decode.org;
				 
                  if (decode === org[i].org) {
                    var target_path = 'uploads/logo-' + org[i].org + '.png'; 
                    res.json(target_path);
                    break;
                  }
                } catch (error) {
                  console.log("error@/logo");
                }
              }
            });
          }, 100);
        });
      }
});





/*
app.get('/api/photo/map', function(req,res){
	var helper = "/uploads/map.png";
	res.json(helper);
})


app.get('/uploads/:id', function(req,res){
	var helper = req.params.id;
	res.json(helper);
})*/


app.delete('/backend/:id', function(req, res){
	var id = req.params.id;
	db.backend.remove({_id: id}, 
function(err,doc){
		res.json(doc);
	});
});

app.get('/backendModify/:id', function(req, res){
	var id = req.params.id;
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.backend.findOne({_id: id},
	function(err,doc){
		res.json(doc);
		});
	});
	
		
app.get('/backend_count/:id', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	var token = req.params.id;	 
  db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {

        var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
        decode = decode.org;
	  if (decode === org[i].org) {		 
          db.backend.count({org:decode},function(err,docs){
		res.json(docs);	
	});
		  break;
        }
      }	  
    });
	}, 100); 
  });
	
		
});

app.get('/deutsch/:id', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type');

var token = req.params.id;	 
  db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {
try{
        var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
        decode = decode.org;
	  if (decode === org[i].org) {		 
          db.backend.find({"sprache": "DE", "aktion":true,"org":decode},
	function(err,doc){
		res.json(doc);
		});
		  break;
        }
}catch(err){
	console.log(err);
}
      }	  
    });
	}, 100); 
  });	
	
});

app.get('/themenDE/:id', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	var token = req.params.id;	 
  db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {

        var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
        decode = decode.org;
	  if (decode === org[i].org) {		 
         db.backend.find({"sprache": "DE", "position":{$ne : null}, "org":decode},
	function(err,doc){
		res.json(doc);
		});
		  break;
        }
      }	  
    });
	}, 100); 
  });	
	
	
	
});
//noch nicht benötigt
app.get('/themenEN', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	db.backend.find({"sprache": "EN", "position":{$ne : null}},
	function(err,doc){
		res.json(doc);
		});
});


app.get('/englisch/:id', function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS'); 
	res.header('Access-Control-Allow-Headers', 'Content-Type');

var token = req.params.id;	 
  db.credentials.count(function(err, docs) {
    var count = docs;
setTimeout(function() {
    db.credentials.find({"org": {$ne: null}}, function(err, doc) {
      var org = [];
      org = doc;
	  
	  //setTimeout(function() {},2);
      for (i = 0; i < count; i++) {

        var decode = jwt.decode(token, org[i].org, function(err_, decode) {
          if (err) {
            return console.error(err.name, err.message);
          }
        });
        decode = decode.org;
	  if (decode === org[i].org) {		 
          db.backend.find({"sprache": "EN", "aktion":true,"org":decode},
	function(err,doc){
		res.json(doc);
		});
		  break;
        }
      }	  
    });
	}, 100); 
  });	
	
});
//done
app.put('/backend/:id', function(req,res){
	var id= req.params.id;
	db.backend.findAndModify({query: {_id: id},
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
