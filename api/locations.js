var MongoClient = require('mongodb').MongoClient;

/// search course by courseconfig id ///
module.exports.scanAreaForInfection = function(req, res) {

console.log('Scanning area');
// samplnge lat : 23.0265853 , lon : 72.5200679
console.log("Lat : "+req.body.lat+", Lon : "+req.body.lon);

var lat = parseFloat(req.body.lat);
var lon = parseFloat(req.body.lon);
var url = "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority";
const options =  { useUnifiedTopology: true, keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true }

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




/// search course by courseconfig id ///
module.exports.addInfectedLocation = function(req, res) {

  console.log('Adding infected location');
  // sample lat : 23.0265853 , lon : 72.5200679
  console.log("Lat : "+req.body.lat+", Lon : "+req.body.lon);
  

  if(!req.body.lat || !req.body.lon || !req.body.name || !req.body.email){
    res.status(400).json({errors:[{code:"err003",message: "Invalid Parameters"}]});
  }else{

    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    var name = req.body.name;
    var email = req.body.email;
  
  
    var url = "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority";
    const options =  { useUnifiedTopology: true, keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true }
    
    MongoClient.connect(url,options, function(err, db) {
      if (err) throw err;
      var dbo = db.db("LocationHistory");
      var infectedLocation = 
      {"email" : email, 
      "name" : name, 
      "infected" : "true", 
      "timestamp" : new Date().getTime(), 
      "location" : {
          "type" : "Point", 
          "coordinates" : [
            lat, 
            lon
          ]
      }};
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
      
     
  
      });
      
  }
    
  
  };