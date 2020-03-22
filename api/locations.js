var MongoClient = require('mongodb').MongoClient;

/// search course by courseconfig id ///
module.exports.scanAreaForInfection = function(req, res) {

console.log('Scanning area');
// sample lat : 23.0265853 , lon : 72.5200679
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
        $maxDistance: 20
      }
    } 
  }).toArray(function(err, result) {
    if (err) throw err;
    console.log(result.length);
    db.close();

    var length = result.length;
    res.send(result);
  });
  
});

};