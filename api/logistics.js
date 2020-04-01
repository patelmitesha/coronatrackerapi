var MongoClient = require('mongodb').MongoClient;
var conf = require("./conf");


/// search course by courseconfig id ///
module.exports.getAllSupportRequests =  async function(req, res) {
console.log("Retriving all support request for "+req.decoded.email);

  var url = conf.production.database.url;
  const options =  conf.production.database.options;

  MongoClient.connect(url,options, function(err, db) {
    if(err){
      res.status(500).json(err);
    }else{
      var dbo = db.db("LocationHistory");
      // var neighborhood = db.Locations.findOne( { location: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ 23.0169186, 72.4724358 ] } } } } )
      dbo.collection("SupportRequests").find( 
      { 
        
      }).toArray(function(errSupportReq, resultSupportReq) {
        if (errSupportReq) 
        {
          res.status(500).json(errSupportReq);
        }else{
          console.log("Returning " + resultSupportReq.length+ " Support Requests.");
          db.close();
          res.send(resultSupportReq);
        }
      
      });

    }

    
  });
  
  };
  

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
        "requestedon" : new Date(), 
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
        if (err) {
          console.log(errSearch);
          res.status(500).json(errSearch);
        }else{

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
                  res.status(400).json({errors:[{code:"err004",message: "You are not authorized or not in the quarantined location."}]});
                }else{
                  dbo.collection("SupportRequests").insertOne(supportRequest, function(err, result) {
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
            
        }

       
    
        });
        
    }
      
    
    };