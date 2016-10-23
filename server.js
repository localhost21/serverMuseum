var express = require('express');
var app = express();


var multer = require('multer');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({
  dest: 'public/uploads/'
});
var fs = require('fs');
var type = upload.single('recfile');
var mongojs = require('mongojs');
var sha256 = require('js-sha256').sha256;
var databaseUrl = "mongodb://admin:admin@ds019076.mlab.com:19076/heroku_bj4gkw7j";
var collections = ["credentials", "backend", "markers", "museum", "archive"];
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var db = mongojs(databaseUrl, collections);
var apiRoutes = express.Router();
var cloudinary = require('cloudinary');
var mongo = require('mongodb');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');





app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');     
  next();
})

cloudinary.config({ 
  cloud_name: 'hhrryft6i', 
  api_key: '229498235345848', 
  api_secret: 'p06oF8E-x9ngJYgBTgsW0dSRxFc' 
});



app.get('/credentials/:id', function(req, res) {    
  var hashedValue = sha256(req.params.id);
  db.credentials.find({
    "login": hashedValue
  }, function(err, doc) {
    if (err) {
      console.log("error - no entries found")
    } else if (doc != "") {
      var helper = doc[0].org;
      var token = jwt.sign(doc[0], helper, {
        expiresIn: 60 * 60
      });
      res.json({
        "status": "true",
        "token": token
      });
    } else {
      res.json("false");
    }
  });
});

var request = require('request');

app.post('/register', function(req, res) {
	var hashedValue = sha256(req.body.creds);	
	
	var secretKey = "	6Leu7AkUAAAAAJGgMQHfxVB3I5OxmUORgLTrKjKO";
	
	var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.recaptcha + "&remoteip=" + req.connection.remoteAddress;

  request(verificationUrl,function(error,response,body) {
    
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
   db.museum.findAndModify({
		query: { org: req.body.name },
		update: {
			$setOnInsert: { 
				"org": req.body.name,
				"museumsname": req.body.name,
				"contactPerson": req.body.contactPerson,
				"mail": req.body.contactPersonMail,
				"tel": req.body.contactPersonTel,
				"de": "Hier kannst du den Über uns Text anpassen",
				"en": "Add your About us text here"
			}
		},
		new: false,   // return new doc if one is upserted
		upsert: true // insert the document if it does not exist

	},  function(err, docs) {
         if(err)
			console.log(err);
    })
	
	
	db.credentials.findOne({org:req.body.name}, function(err,doc){
		var nameExists = doc;
		db.credentials.findAndModify({
			query: { login: hashedValue },
			update: {
				$setOnInsert: { 
					"org": req.body.name,
					"contactPerson": req.body.contactPerson,
					"mail": req.body.contactPersonMail,
					"tel": req.body.contactPersonTel,
					"login": hashedValue
				}
			},
			new: false,   // return new doc if one is upserted
			upsert: true // insert the document if it does not exist
		}, function(err, docs) {
			res.json({"login":docs, "nameExists":nameExists});
	
		})	
	})
	
	  });
});




app.get('/register/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
        db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
              db.credentials.find({
                org: decode
              }, function(err, docs) {
                res.json(docs);
              });
              break;
            }
          }
        });
  }
});


app.get('/getLogin/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
        db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
              db.credentials.find(function(err, docs) {
				 
				  var resArr = [];
				  docs.forEach(function(login){
					  resArr.push({
					"org": login.org,
					"contactPerson": login.contactPerson,
					"mail": login.mail,
					"rolle": login.rolle
					});
				  });
                res.json(resArr);
              });
              break;
            }
          }
        });
  }
});



app.get('/getHashTrue/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
        db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
              if(org[i].login==="902baf20b5df5c6bbd4c8798b3cecca534c42b1b55334d4515303c9edfd29748"){
				  res.json(true);
			  }else{
				  res.json(false);
			  }
              break;
            }
          }
        });
  }
});


app.get('/login', function(req, res) {
  db.museum.find({
    "org": {
		$ne: null
	}
  },function(err, doc) {
    res.json(doc);
  });
});

app.get('/login/:id', function(req, res) {    
  var org = req.params.id;
  db.museum.find({
    "org": org
  }, function(err, doc) {
    if (err) {
      console.log("error - no entries found")
    } else if (doc != "") {
      var token = jwt.sign(doc[0], org, {
        expiresIn: 60 * 60
      });
      res.json({
        "token": token,
		"org": org
      });
    } else {
      res.json("false");
    }
  });

});

app.get('/backend/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {			  
	 db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
              db.backend.find({
                org: decode
              }, function(err, docs) {
                res.json(docs);
              });
              break;
            }
          }
        });			  
}			  			  
});

app.post('/backend/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
        db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
			  
              break;
            }
          }
        });
  }
});



app.post('/markers/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
        db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
                writeConcern: {
                  w: "majority",
                  wtimeout: 5000
                }
              })
              break;
            }
          }
    });
  }
});

app.post('/markersNew/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
        db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
              break;
            }
          }
        });
  }
});


app.put('/themenliste/:organization', function(req, res) {
	var id = req.params.organization;       
	var o_id = new mongo.ObjectID(id);	
				
				
  var id = req.params.id;
  db.museum.findAndModify({
    query: {
	  _id: o_id
    },
    update: {
      $set: {
        nummer: req.body.nummer,
		name: req.body.name
      }
    },
    nex: true
  }, function(err, doc) {
    res.json(doc);
  });
});


app.get('/getPos/:org/:theme', function(req,res){
	var org = req.params.org;
	var theme = req.params.theme;
	 db.museum.findOne({ 
	   nummer: theme,
	   zugehörigkeit: org
     },
     function(err, doc) {
       res.json(doc);
     });	
});

app.post('/themenliste/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
       db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
              var h = ',"zugehörigkeit":"' + decode + '"}';
              var helper = request.replace("}", h);
              db.museum.insert(JSON.parse(helper), function(err, doc) {
                res.json(doc);
              });
              break;
            }
          }
        });
  }
});


app.get('/nonWalkerMarkers/:id',function(req,res){
	var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
        db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
            try {
              var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                if (err) {
                  return console.error(err.name, err.message);
                }
              });
              decode = decode.org;
              if (decode === org[i].org) {
                db.markers.find({
                  org: decode,
				  name: {
					  $ne:"walker"
					  }
                }, function(err, docs) {
                  res.json(docs);
                });
                break;
              }
            } catch (error) {
              console.log("1:error@/museum");
            }
          }
        });
  }
});

app.get('/markers/:id', function(req, res) {    
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
     db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
            try {
              var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                if (err) {
                  return console.error(err.name, err.message);
                }
              });
              decode = decode.org;
              if (decode === org[i].org) {
                db.markers.find({
                  org: decode
                }, function(err, docs) {
                  res.json(docs);
                });
                break;
              }
            } catch (error) {
              console.log("2:error@/museum");
            }
          }
        });
  }
});



app.put('/museumDE/:id', function(req, res) {
  var id = req.params.id;
  db.museum.findAndModify({
    query: {
      _id: id
    },
    update: {
      $set: {
        de: req.body.de
      }
    },
    nex: true
  }, function(err, doc) {
    res.json(doc);
  });
});

app.put('/museumEN/:id', function(req, res) {
  var id = req.params.id;
  db.museum.findAndModify({
    query: {
      _id: id
    },
    update: {
      $set: {
        en: req.body.en
      }
    },
    nex: true
  }, function(err, doc) {
    res.json(doc);
  });
});


app.put('/museumName/:id', function(req, res) {
  var id = req.params.id;
  db.museum.findAndModify({
    query: {
      org: id
    },
    update: {
      $set: {
        museumsname: req.body.museumsname
      }
    },
    nex: true
  }, function(err, doc) {
    res.json(doc);
  });

});


app.put('/registerContact/:id', function(req, res) {
  var org = req.params.id;
  db.credentials.update({
      org: org
    },{
      $set: {
        'contactPerson': req.body.contactPerson
	  } 
	
   
  },{nex: true,
	multi: true}, function(err, doc) {	  
    res.json(doc);
  });
});

app.put('/registerMail/:id', function(req, res) {
  var org = req.params.id;
  db.credentials.update({
      org: org
    },{
      $set: {
        'mail': req.body.mail
	  } 
	
   
  },{nex: true,
	multi: true}, function(err, doc) {	  
    res.json(doc);
  });
});


app.put('/registerTel/:id', function(req, res) {
  var org = req.params.id;
 db.credentials.update({
      org: org
    },{
      $set: {
        'tel': req.body.tel
	  } 
	
   
  },{nex: true,
	multi: true}, function(err, doc) {	  
    res.json(doc);
  });
});



app.get('/museum/:id', function(req, res) {    
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
       db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
            try {
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
            }catch (error) {
              console.log("8:error@/museum");
            }
          }
        });
  }
});

app.delete('/markers/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
  } else {
      db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
            try {
              var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                if (err) {
                  return console.error(err.name, err.message);
                }
              });
              decode = decode.org;
              if (decode === org[i].org) {
                db.markers.remove({
                  "org": decode
                });
                break;
              }
            } catch (error) {
              console.log("3:error@/museum");
            }
          }
        });
  }
});


app.delete('/deleteSingleMarkers/:id', function(req, res) {
  var id = req.params.id;
  db.markers.remove({
      message: id
    },
    function(err, doc) {
      res.json(doc);
    });
});


app.get('/publicThemes/:organization', function(req,res){
  db.museum.find({       
	   "zugehörigkeit": req.params.organization
     },
     function(err, doc) {
       res.json(doc);
    });
});


app.post('/api/photo/logo/:id', type, function(req, res) {
  var token = req.params.id;
  var tmp_path = req.file.path;
  if (token === "") {
    res.end();
  } else {
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
				 cloudinary.uploader.upload(tmp_path, function(result) { 
					var id = result.secure_url;
					db.museum.findAndModify({
						query: {
						org: org[i].org
						},
						update: {
						$set: {
							logo: id
						}
						},
						nex: true
					}, function(err, doc) {
						res.redirect('/#/custo');
					});
				}); 
                break;
              }
            } catch (error) {
              console.log("4:error@/museum");
            }
          }
        });
  }
});

app.post('/api/photo/map/:id', type, function(req, res) {
  var token = req.params.id;
  var tmp_path = req.file.path;
  if (token === "") {
    res.end();
  } else {
      db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
            try {
              var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                if (err) {
                  return console.error(err.name, err.message);
                }
              });
              decode = decode.org;
              if (decode === org[i].org) {
				 cloudinary.uploader.upload(tmp_path, function(result) { 
					var id = result.secure_url;
					db.museum.findAndModify({
						query: {
						org: org[i].org
						},
						update: {
						$set: {
							map: id
						}
						},
						nex: true
					}, function(err, doc) {
						res.redirect('/#/custo');
					});
				}); 
                break;
              }
            } catch (error) {
              console.log("5:error@/museum");
            }
          }
        });
  }
});
app.post('/archiveMarkers/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
  } else {
      db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
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
                  documents: [{
                    "name": "markers-" + date.toDateString(),
                    "org": decode,
                    blup
                  }],
                  ordered: false,
                  writeConcern: {
                    w: "majority",
                    wtimeout: 5000
                  }
                })
                break;
              }
            } catch (error) {
              console.log("6:error@/museum");
            }
          }
        });
  }
});

app.get('/archived/:id', function(req, res) {    
  var token = req.params.id;
  if (token === "") {
  } else {
       db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
            try {
              var decode = jwt.decode(token, org[i].org, function(err_, decode) {
                if (err) {
                  return console.error(err.name, err.message);
                }
              });
              decode = decode.org;
              if (decode === org[i].org) {
                db.archive.find({
                  "org": decode
                }, function(err, docs) {
                  var a = JSON.stringify(docs);
                  res.json(JSON.parse(a));
                });
                break;
              }
            } catch (error) {
              console.log("7:error@/museum");
            }
          }
        });
  }
});

app.get('/archiveMarkers/:id', function(req, res) {
  var id = req.params.id;    
  db.archive.findOne({
      _id: id
    },
    function(err, doc) {
      res.json(doc);
    });
});

app.get('/orgName/:id', function(req, res) {
  var token = req.params.id;
  if (token === "") {
    res.end();
  } else {
      db.credentials.find({
          "org": {
            $ne: null
          }
        }, function(err, doc) {
          var org = [];
          org = doc;
          for (i = 0; i < i+1; i++) {
            try {
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
            } catch (error) {
              console.log("error");
            }
          };
        });
  }
})

app.delete('/backend/:id', function(req, res) {
  var id = req.params.id;
  db.backend.remove({
      _id: id
    },
    function(err, doc) {
      //res.json(doc);
    });
	
	
	
	var o_id = new mongo.ObjectID(id);
	 db.backend.remove({
      _id: o_id
    },
    function(err, doc) {
      //res.json(doc);
    });
});

app.get('/backendModify/:id', function(req, res) {
  var id = req.params.id;    
  db.backend.findOne({
      name_de: id
    },
    function(err, doc) {
      res.json(doc);
    });
});

app.get('/markersModify/:id', function(req, res) {
  var id = req.params.id;    
  db.markers.findOne({
      message: id
    },
    function(err, doc) {
      res.json(doc);
    });
});



app.get('/backend_count/:id', function(req, res) {
  var token = req.params.id;
     db.credentials.find({
        "org": {
          $ne: null
        }
      }, function(err, doc) {
        var org = [];
        org = doc;
        for (i = 0; i < i+1; i++) {
          var decode = jwt.decode(token, org[i].org, function(err_, decode) {
            if (err) {
              return console.error(err.name, err.message);
            }
          });
          decode = decode.org;
          if (decode === org[i].org) {
            db.backend.count({
              org: decode
            }, function(err, docs) {
              res.json(docs);
            });
            break;
          }
        }
      });
});

app.get('/deutsch/:id', function(req, res) {
  var token = req.params.id;
       db.credentials.find({
        "org": {
          $ne: null
        }
      }, function(err, doc) {
        var org = [];
        org = doc;
        for (i = 0; i < i+1; i++) {
          try {
            var decode = jwt.decode(token, org[i].org, function(err_, decode) {
              if (err) {
                return console.error(err.name, err.message);
              }
            });
            decode = decode.org;
            if (decode === org[i].org) {
              db.backend.find({
                  "aktion": true,
                  "org": decode
                },
                function(err, doc) {
                  res.json(doc);
                });
              break;
            }
          } catch (err) {
            console.log(err);
          }
        }
      });

});


app.delete('/deleteThemenliste/:nummer/:organization', function(req, res) {	
  db.museum.remove({
				"zugehörigkeit": req.params.organization,
				nummer: req.params.nummer
			},
			function(err, doc) {
				res.json(doc);
			});
});



app.get('/themenListe/:id', function(req,res){
	var token = req.params.id;
       db.credentials.find({
        "org": {
          $ne: null
        }
      }, function(err, doc) {
        var org = [];
        org = doc;
        for (i = 0; i < i+1; i++) {
          var decode = jwt.decode(token, org[i].org, function(err_, decode) {
            if (err) {
              return console.error(err.name, err.message);
            }
          });
          decode = decode.org;
          if (decode === org[i].org) {
            db.museum.find({                
                "zugehörigkeit": decode,
              },
              function(err, doc) {
                res.json(doc);
              });
            break;
          }
        }
      });
});



app.get('/getOneTheme/:id/:organization', function(req,res){
  db.museum.findOne({                
       "nummer": req.params.id,
	   "zugehörigkeit": req.params.organization
     },
     function(err, doc) {
       res.json(doc);
    });
});







app.get('/themenDE/:id', function(req, res) {    
  var token = req.params.id;
     db.credentials.find({
        "org": {
          $ne: null
        }
      }, function(err, doc) {
        var org = [];
        org = doc;
        for (i = 0; i < i+1; i++) {
          var decode = jwt.decode(token, org[i].org, function(err_, decode) {
            if (err) {
              return console.error(err.name, err.message);
            }
          });
          decode = decode.org;
          if (decode === org[i].org) {
            db.backend.find({
                "sprache": "DE",
                "theme": {
                  $ne: null
                },
                "org": decode,
				"aktiv": true
              },
              function(err, doc) {
                res.json(doc);
              });
            break;
          }
        }
      });
});
/*noch nicht benötigt
app.get('/themenEN', function(req, res) {    
  db.backend.find({
      "sprache": "EN",
      "theme": {
        $ne: null
      }
    },
    function(err, doc) {
      res.json(doc);
    });
});*/



app.put('/backend/:id', function(req, res) {
  var id = req.params.id;
  db.backend.findAndModify({
    query: {
      _id: id
    },
    update: {
      $set: {
        ide: req.body.ide,
        bild: req.body.bild,
        name_de: req.body.name_de,
        name_en: req.body.name_en,
		beschreibung_de: req.body.beschreibung_de,
		beschreibung_en: req.body.beschreibung_en,
        position: req.body.position,
        theme: req.body.theme,
        audio_de: req.body.audio_de,
        audio_en: req.body.audio_en,
        aktion: req.body.aktion,
        sprache: req.body.sprache
      }
    },
    nex: true
  }, function(err, doc) {
    
  });
  
    var o_id = new mongo.ObjectID(id);
  db.backend.findAndModify({
    query: {
      _id: o_id
    },
    update: {
      $set: {
        ide: req.body.ide,
        bild: req.body.bild,
        name_de: req.body.name_de,
        name_en: req.body.name_en,
		beschreibung_de: req.body.beschreibung_de,
		beschreibung_en: req.body.beschreibung_en,
        position: req.body.position,
        theme: req.body.theme,
        audio_de: req.body.audio_de,
        audio_en: req.body.audio_en,
        aktion: req.body.aktion,
        sprache: req.body.sprache
      }
    },
    nex: true
  }, function(err, doc) {
    res.json(doc);
  });
});


app.put('/markers/:id', function(req, res) {
  var mes = req.body.message;
  var name = req.body.name;
  var org = req.params.id;
  var lat = req.body.lat;
  var lng = req.body.lng;
  db.markers.findAndModify({
    query: {
      lat: lat,
	  lng: lng,
	  org: org
    },
    update: {
      $set: {
        
		name: name,
		message: mes
		
      }
    },
    nex: true
  }, function(err, doc) {
	  
    res.json(doc);
  });
});

app.get('/getBeacons/:id', function(req, res) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://cloud.estimote.com/v2/devices",  false);
  xmlHttp.setRequestHeader('Authorization', 'Basic YXVkaW9ndWlkZS0weHE6NWIzOTc5MzAzZTdhMWQ2YjY0MWUzMGQ2YTA1YWM0MmM=');
  xmlHttp.setRequestHeader('Accept', 'application/json'); 
  xmlHttp.send();
  var all = JSON.parse(xmlHttp.responseText);
  var token = req.params.id;
      db.credentials.find({
        "org": {
          $ne: null
        }
      }, function(err, doc) {
        var org = [];
        org = doc;
        for (i = 0; i < i+1; i++) {
          var decode = jwt.decode(token, org[i].org, function(err_, decode) {
            if (err) {
              return console.error(err.name, err.message);
            }
          });
          decode = decode.org;
          if (decode === org[i].org) {
              var returner = [];  
			all.forEach(function(beacon){
				if(beacon.shadow.tags[0]==decode){
					returner.push(beacon);
				}
			});
			
			res.json(returner);
					
            break;
          }
        }
      });

});


app.get('/beaconModify/:id', function(req, res) {
  var id = req.params.id;    
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://cloud.estimote.com/v2/devices/" + id, false);
  xmlHttp.setRequestHeader('Authorization', 'Basic YXVkaW9ndWlkZS0weHE6NWIzOTc5MzAzZTdhMWQ2YjY0MWUzMGQ2YTA1YWM0MmM=');
  xmlHttp.setRequestHeader('Accept', 'application/json');
  xmlHttp.send();
  res.json(JSON.parse(xmlHttp.responseText));
});


app.put('/setBeacons/', function(req, res) {
  var identifier= req.body.identifier; 
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();   
  xmlHttp.open("POST", "https://cloud.estimote.com/v2/devices/" + identifier, false);
  xmlHttp.setRequestHeader('Authorization', 'Basic YXVkaW9ndWlkZS0weHE6NWIzOTc5MzAzZTdhMWQ2YjY0MWUzMGQ2YTA1YWM0MmM=');
  xmlHttp.setRequestHeader('Accept', 'application/json');
  xmlHttp.setRequestHeader('Content-Type', 'application/json');  
  var data = JSON.stringify(
  {"shadow":{"name":req.body.shadow.name},"pending_settings": {"advertisers":{"ibeacon":[{"index":1,"enabled":true,"uuid":"B9407F30-F5F8-466E-AFF9-25556B57FE6D","major":req.body.settings.advertisers.ibeacon[0].major,"minor":req.body.settings.advertisers.ibeacon[0].minor,"power":req.body.settings.advertisers.ibeacon[0].power,"interval":req.body.settings.advertisers.ibeacon[0].interval,"security":{"enabled":false,"real_id":328119,"interval_scaler":10},"non_strict_mode_enabled":true}]}}});
  xmlHttp.send(data);
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
