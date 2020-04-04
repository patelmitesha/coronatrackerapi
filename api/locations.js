var MongoClient = require('mongodb').MongoClient;
var conf = require("./conf");



/// search course by courseconfig id ///
module.exports.scanAreaForInfection = function(req, res) {

console.log('Scanning area');
console.log("Lat : "+req.body.lat+", Lon : "+req.body.lon);

var lat = parseFloat(req.body.lat);
var lon = parseFloat(req.body.lon);

var url = conf.production.database.url;
const options =  conf.production.database.options;

MongoClient.connect(url,options, function(err, db) {
  if (err) throw err;
  var dbo = db.db("LocationHistory");
  // var neighborhood = db.Locations.findOne( { location: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ 23.0169186, 72.4724358 ] } } } } )
  dbo.collection("Locations").find( 
  { 
    location : 
    { 
      $nearSphere : 
      { 
        $geometry: { type: "Point", coordinates: [ lat , lon ] },
        $minDistance: 0,
        $maxDistance: 100
      }
    } 
  }).toArray(function(err, result) {
    if (err) throw err;
    console.log("Returning " + result.length+ " locations.");
    db.close();

    var length = result.length;
    res.send(result);
  });
  
});

};


module.exports.addSuspectedPatient = function(req, res){
  console.log('Adding suspected patient');
  
  let ipAddr = req.connection.remoteAddress;

  if (req.headers && req.headers['x-forwarded-for']) {
    [ipAddr] = req.headers['x-forwarded-for'].split(',');
  }

  if(!req.body.lat || !req.body.lon || !req.body.nameofsuspectedpatient || 
    !req.body.pincodeofsuspectedpatient || !req.body.details){
    res.status(400).json({errors:[{code:"err003",message: "Invalid Parameters"}]});
  }else{

    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    var nameofsuspectedpatient = req.body.nameofsuspectedpatient;
    var pincodeofsuspectedpatient = req.body.pincodeofsuspectedpatient;
    var details = req.body.details;
    var informerEmail = req.decoded.email;
    var informerName = req.decoded.name;
    var addressofsuspectedpatient = req.body.addressofsuspectedpatient;

    var url = conf.production.database.url;
    const options =  conf.production.database.options;
    
    MongoClient.connect(url,options, function(err, db) {
      if (err) throw err;
      var dbo = db.db("LocationHistory");
      var infectedLocation = 
      {
        "nameofsuspectedpatient" : nameofsuspectedpatient,
        "addressofsuspectedpatient" : addressofsuspectedpatient,
        "pincode" : pincodeofsuspectedpatient,
        "details" : details,
        "informeremail" : informerEmail, 
        "informername" : informerName, 
        "infected" : false, 
        "verified" : false,
        "verifiedby" : null,
        "verificationdate" : null,
        "location" : {
            "type" : "Point", 
            "coordinates" : [
              lat, 
              lon
            ]
        },
        "timestamp" : new Date(), 
        "ipaddress" : ipAddr
      };

      
      dbo.collection("SuspeciousLocations").find( 
        { 
          informeremail:informerEmail
        }).toArray(function(errSuspecious, resultSuspecious) {
          if (errSuspecious) {
            res.status(400).json({errors:[{code:"err003",message: "Error occured while inserting"}]});
          }else{

          if(resultSuspecious.length>=10){
            res.status(400).json({errors:[{code:"err003",message: "You are not allowed to report more than 10 supected patient"}]});
            }else{


         dbo.collection("SuspeciousLocations").insertOne(infectedLocation, function(err, result) {
              if (err) {
                console.log(err);
                res.status(500).json(err);
              }else{
                console.log("inserted : " + nameofsuspectedpatient + ", as suspected");
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


module.exports.getalllocations = function(req,res){
  var url = conf.production.database.url;
  
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }else{
  var dbo = db.db("LocationHistory");
  dbo.collection("Locations").find({}).toArray( function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }else{

      db.close();
      res.send(result);
    }
  });
}
  });
}

module.exports.getallsuspeciouslocations = function(req,res){
  var url = conf.production.database.url;
  
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }else{
  var dbo = db.db("LocationHistory");
  dbo.collection("SuspeciousLocations").find({}).toArray( function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }else{

      db.close();
      res.send(result);
    }
  });
}
  });
}

/// search course by courseconfig id ///
module.exports.addInfectedLocation = function(req, res) {

  console.log('Adding infected location');
  // sample lat : 23.0265853 , lon : 72.5200679
  console.log("Lat : "+req.body.lat+", Lon : "+req.body.lon);
  
  let ipAddr = req.connection.remoteAddress;

  if (req.headers && req.headers['x-forwarded-for']) {
    [ipAddr] = req.headers['x-forwarded-for'].split(',');
  }

  if(!req.body.lat || !req.body.lon || !req.body.name || !req.body.email || !req.body.pincode){
    res.status(400).json({errors:[{code:"err003",message: "Invalid Parameters"}]});
  }else{

    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    var name = req.body.name;
    var email = req.decoded.email;
    var mob = req.body.mob;
    var pincode = req.body.pincode;
    var locationtype = req.body.locationtype;
    var taggedby = req.decoded.email;
  
    var url = conf.production.database.url;
    const options =  conf.production.database.options;
        
    MongoClient.connect(url,options, function(err, db) {
      if (err) throw err;
      var dbo = db.db("LocationHistory");
      var infectedLocation = 
      {
        "email" : email, 
        "name" : name, 
        "mob" : mob,
        "infected" : "true", 
        "location" : {
            "type" : "Point", 
            "coordinates" : [
              lat, 
              lon
            ]
        },
        "locationtype" : locationtype,
        "timestamp" : new Date(), 
        "pincode" : pincode,
        "taggedby" : taggedby,
        "ipaddress" : ipAddr
      };

      dbo.collection("Users").find( 
        { 
          email:taggedby,
          role:'FieldWorker'
        }).toArray(function(errAuthorized, resultAuthorized) {
          if (errAuthorized) {
            console.log(errAuthorized);
            res.status(400).json({errors:[{code:"err003",message: "Error occured while inserting"}]});
          }else{
            if(resultAuthorized.length<=0){
              console.log("Unauthorized Error");
              res.status(400).json({errors:[{code:"err003",message: "You are not authorised to tag the location."}]});  
            }else{

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
        } 
      }).toArray(function(errDuplicate, resultDuplicate) {
        if (errDuplicate) {
          console.log(errDuplicate);
          res.status(500).json(errDuplicate);
        }else{
          if(resultDuplicate.length>0){
            db.close();
            res.status(400).json({errors:[{code:"err003",message: "This place has already been added."}]});
          }else{
            dbo.collection("Locations").insertOne(infectedLocation, function(err, result) {
              if (err) {
                console.log(err);
                res.status(500).json(err);
              }else{
                console.log("inserted : " + infectedLocation+ ", result : "+result);
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
  }
  });

  
      });
      
  }
    
  
  };