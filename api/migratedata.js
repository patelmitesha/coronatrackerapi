
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

var url = "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority";
var fs = require('fs'),
path = require('path'),    
filePath = path.join(__dirname, '/data/Location History_mitesh.json');

module.exports.readFile = function(req, res){
    
const options =  { useUnifiedTopology: true, keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true }
    MongoClient.connect(url, options, function(err, db) {
        if (err) throw err;
        var dbo = db.db("LocationHistory");

        var tmpUsername = "mitesh";
        var tmpInfected = "true";
    
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            let locationHistory = JSON.parse(data);
            var locations =locationHistory.locations; 
            var startDate = moment();

            var docs=[];
            for(var i = 0;i< (locations.length);i++)
            {
                
                var tmpDate = new Date(JSON.parse(locations[i].timestampMs));
                var tmpDateNew = moment(tmpDate);
                var days = startDate.diff(tmpDate, 'days');

                if(days <= 100){
                        console.log(i + " (True) : " + tmpDate + " / "+ startDate.toISOString() + " : "+days);

                        var myobj = { "userid" : tmpUsername, "infected":tmpInfected, "timestamp": locations[i].timestampMs, "location": {
                            "type": "Point",
                            "coordinates": [(locations[i].latitudeE7 / 10000000), (locations[i].longitudeE7 / 10000000)]  } };
                            docs.push(myobj);
                        
                }
            }

            dbo.collection("Locations").insertMany(docs, function(err, data) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log("insert succes...");
                res.send("Success");
            });
         //db.close();
            
        } else {
            console.log(err);
        }
    });

    });

 //   res.send("OK");
}