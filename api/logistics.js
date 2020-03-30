var MongoClient = require('mongodb').MongoClient;
var conf = require("./conf");

module.exports.addSupportRequest = function(req, res) {

    console.log('Adding Support Request');
    // sample lat : 23.0265853 , lon : 72.5200679
    console.log("Lat : "+req.body.lat+", Lon : "+req.body.lon);
    
    let ipAddr = req.connection.remoteAddress;
  
    if (req.headers && req.headers['x-forwarded-for']) {
      [ipAddr] = req.headers['x-forwarded-for'].split(',');
    }
  
    if(!req.body.lat || !req.body.lon || !req.body.requesttype || !req.body.msg || !req.body.email){
      res.status(400).json({errors:[{code:"err003",message: "Invalid Parameters"}]});
    }else{
  
      var lat = parseFloat(req.body.lat);
      var lon = parseFloat(req.body.lon);
      var email = req.body.email;
      var requesttype = req.body.requesttype;
      var msg = req.body.msg;
      var contactno = req.body.contactno;
      var locationtype = new Date();
      var priority = "NORMAL";
    
      var url = conf.production.database.url;
      const options =  conf.production.database.options;

      var supportRequest = 
      {
        "email" : email,
        "requesttype":requesttype,
        "msg":msg,
        "contactno":contactno,
        "priority":priority,
        "status" : "PENDING",
        "location" : {
            "type" : "Point", 
            "coordinates" : [
              lat, 
              lon
            ]
        },
        "ipaddress" : ipAddr
      };

      MongoClient.connect(url,options, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LocationHistory");
  
      dbo.collection("Locations").find( 
        { 
          location : 
          { 
            $nearSphere : 
            { 
              $geometry: { type: "Point", coordinates: [ lat , lon ] },
              $minDistance: 0,
              $maxDistance: 10
            }
          } , email: email
        }).toArray(function(errSearch, resultSearch) {
          if (errSearch) {
            console.log(errSearch);
            res.status(500).json(errSearch);
          }else{
            if(resultSearch.length<=0){
              db.close();
              res.status(400).json({errors:[{code:"err004",message: "You are not authorized / not in you quarantined location."}]});
            }else{
              dbo.collection("SupprotRequests").insertOne(supportRequest, function(err, result) {
                if (err) {
                  console.log(err);
                  res.status(500).json(err);
                }else{
                  console.log("Inserted Reqeust for : " + requesttype+ ", from : "+email);
                  db.close();
            
                  res.status(200).json(
                    {
                      success:'OK'
                    });
            
            
                }
              });
    
            }
          
          }
  
      });
        
       
    
        });
        
    }
      
    
    };