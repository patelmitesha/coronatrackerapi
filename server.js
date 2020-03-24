const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
var cors = require('cors')

var MongoClient = require('mongodb').MongoClient;
var ctrlUpload = require('./api/upload');
var ctrlMigration = require('./api/migratedata');
var ctrlLocation = require('./api/locations');


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*app.use(function applyXFrame(req,res,next){
	res.set('X-Frame-Options','DENY');
	next();
});*/

// app.use(cors());
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
if(req.method === 'OPTONS'){
	res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
	return res.status(200).json({});
}
  next();
});


app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.post('/upload', ctrlUpload.upload);

app.post('/readFile',ctrlMigration.readFile);

app.post('/scanareaforinfection',ctrlLocation.scanAreaForInfection);

app.get('/getlocation', (req, res) => {
   // Run the query
   

var url = "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("LocationHistory");
  dbo.collection("Locations").find({}).toArray( function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();

    res.send(result);
  });
});
   
   /*
db.collection('Locations').find({});
console.log(locations);
res.send('Hello from App Engine!');
   */
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});