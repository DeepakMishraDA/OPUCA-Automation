const { OPCUAClient, makeBrowsePath, AttributeIds} = require("node-opcua");
const async = require('async');
require('dotenv').config();

const endpointUrl = process.env.ENDPOINT_URL2 ;
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
             the_session.read({nodeId: "ns=4;s=|var|CODESYS Control for Raspberry Pi MC SL.Application.S01_.S01_T01_C001_AI",attributeId: AttributeIds.Value}, (err, data)=> {
              if (!err){
                console.log("This is it",data.value.value)
              }
             })
           }, 1000)
           },
         
 ])

// (async () => {
//   await tmpOPCUA()
// })();