const { OPCUAClient, makeBrowsePath, AttributeIds} = require("node-opcua");
const async = require('async');
require('dotenv').config();

const endpointUrl = process.env.ENDPOINT_URL ;
const client = OPCUAClient.create({
                endpointMustExist: false
            });
let the_session;
client.on("backoff", (retry, delay) =>
              console.log(
                "still trying to connect to ",
                endpointUrl,
                ": retry =",
                retry,
                "next attempt in ",
                delay / 1000,
                "seconds"
              ));  
client.on('connection_lost', () => {
     process.exit(0);
  });

async.series([
    //connection
      function (callback){
           client.connect(endpointUrl, function(err) {
              if (err) {
                console.log(" cannot connect to endpoint :", endpointUrl);
              } else {
                console.log(`connected to ${endpointUrl}`);
              }
              callback();
            });
           
          },
    //session
          function (callback){
            client.createSession((err, session)=> {
               if (err) {
                return;
               }
               the_session = session;
               callback();
             });
           },
    //reading variables       
           function (callback){ 
           setInterval(() => {
             the_session.read({nodeId: process.env.NODE_ONE,attributeId: AttributeIds.DataType}, (err, data)=> {
              if (!err){
                console.log("This is it",data.value)
              }
             })
           }, 1000)
           },
         
 ])

// (async () => {
//   await tmpOPCUA()
// })();