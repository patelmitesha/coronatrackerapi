const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
var cors = require('cors')
var conf = require("./api/conf");

var MongoClient = require('mongodb').MongoClient;
var ctrlUpload = require('./api/upload');
var ctrlMigration = require('./api/migratedata');
var ctrlLocation = require('./api/locations');
var ctrlLogistics = require('./api/logistics');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("541393556865-h58ggrbjrcaorgd6rof75p9tdm3ir9ha.apps.googleusercontent.com");

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

//  app.post('/upload', ctrlUpload.upload);

//  app.post('/readFile',ctrlMigration.readFile);

app.post('/scanareaforinfection',ctrlLocation.scanAreaForInfection);

app.use(async function(req, res, next) {
  console.log('private api authentication');
  var token = req.body.token || req.params.token || req.headers['x-access-token'];

	// decode token googleauthclientid
	if (token) {
    try{
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: conf.production.googleauthclientid  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   // console.log(payload);
    req.decoded = payload;	
    next();
  }catch(error){
		return res.status(403).send({ 
			success: false, 
			message: 'Invalid Login'
		});

  }
  } else {
		console.log('token not found');
		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
});

app.post('/privateapi/getAllSupportRequests',ctrlLogistics.getAllSupportRequests);

app.post('/privateapi/getalllocations', ctrlLocation.getalllocations );

app.post('/privateapi/addInfectedLocation',ctrlLocation.addInfectedLocation);

app.post('/privateapi/getMySupportRequests',ctrlLogistics.getMySupportRequests);

app.post('/privateapi/addSuspectedPatient',ctrlLocation.addSuspectedPatient);

app.post('/privateapi/getSupReqByCitizensUnderAssistant',ctrlLogistics.getSupReqByCitizensUnderAssistant);

app.post('/privateapi/getAllSuspeciousLocations',ctrlLocation.getallsuspeciouslocations);

app.post('/privateapi/addSupportRequest',ctrlLogistics.addSupportRequest);

app.post('/privateapi/markAsResolved',ctrlLogistics.updateSupportRequestStatus);

app.post('/privateapi/addInfectedLocation',ctrlLocation.addInfectedLocation);



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});