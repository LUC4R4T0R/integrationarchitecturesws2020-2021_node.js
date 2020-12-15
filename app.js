const express = require('express'); //load the express module
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //adds support for json encoded bodies
const fs = require('fs');
const mongodb = require('mongodb');

//swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('swagger.yml');
app.use('/swagger-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//load config data
const rawConfig = fs.readFileSync('./config.json');
const config = JSON.parse(rawConfig);

//load and start API-connectors
const OrangeHRMConnector = require('./connectors/OrangeHRM');
const oHRM = new OrangeHRMConnector(config["OrangeHRM_URL"], config["OrangeHRM_username"], config["OrangeHRM_password"], 2);
const OpenCRXConnector = require('./connectors/OpenCRX');
const oCRX = new OpenCRXConnector(config["OpenCRX_URL"], config["OpenCRX_username"], config["OpenCRX_password"]);

//loading prototypes for common Objects
const Salesman = require('./api/Salesman');
const EvaluationRecord = require('./api/EvaluationRecord');
const EvaluationRecordEntry = require('./api/EvaluationRecordEntry');

//starting database-connection and local API
const MongoClient = mongodb.MongoClient;
let auth = "";
if (config["MongoDB_username"] !== ""){
   auth = config["MongoDB_username"] + ":" + config["MongoDB_username"] + "@";
}
MongoClient.connect("mongodb://"+ auth + config["MongoDB_domain"] + ":" + config["MongoDB_port"] + "/", function(err, database) {
   if(err) {
      throw err;
   }

   app.set('db', database.db(config["MongoDB_database"]));

   app.listen(config["API_port"], () => {
      console.log('Server started.');
   });
});


/*
   Routes
 */

// Salesman

//app.post('/salesman', Salesman.create);
app.get('/salesman', Salesman.list);
app.get('/salesman/:id', Salesman.find);
//app.put('/salesman', Salesman.update);
//app.delete('/salesman/:id', Salesman.remove);


// EvaluationRecord

app.get('/salesman/:id/evaluationrecord', EvaluationRecord.list);
app.post('/salesman/:id/evaluationrecord', EvaluationRecord.create);
// app.put('/salesman/:id/evaluationrecord', EvaluationRecord.update);
app.get('/salesman/:id/evaluationrecord/:year', EvaluationRecord.find);
app.delete('/salesman/:id/evaluationrecord/:year', EvaluationRecord.remove);


// EvaluationRecordEntry

app.get('/salesman/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.list);
app.post('/salesman/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.create);
app.put('/salesman/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.update);
app.get('/salesman/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.find);
app.delete('/salesman/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.remove);

/*
app.get('/test', (req,res) => {
   //oHRM.addBonusSalary(8, 2021, 1000000);
   (async function() {
      res.send(await oHRM.getSalesmen());
   })()
});

app.get('/testUser', (req, res) => {
   (async function(){
      res.send(await oCRX.getUserByGovernmentId(91337));
   })();
});

app.get('/testSalesOrder', (req, res) => {
   (async function(){
      res.send(await oCRX.getSalesOrderByAccountId('xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9ENFSDRCBESBTH2MA4T2TYJFL'));
   })();
});

app.get('/testContract', (req, res) => {
   (async function(){
      res.send(await oCRX.getContractPositions('9ENGNFGDLDQSPH2MA4T2TYJFL'));
   })();
});

app.get('/testRating', (req, res) => {
   (async function(){
      res.send(await oCRX.getRating('9ENGNFGDLDQSPH2MA4T2TYJFL'));
   })();
});
 */