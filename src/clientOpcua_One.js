const { OPCUAClient, makeBrowsePath, AttributeIds, DataType} = require("node-opcua");
const async = require('async');
require('dotenv').config();

const endpointUrl = "opc.tcp://deepak-ThinkPad-T470s-W10DG:4840/GreenFusion/TestingOPCUAServ" //process.env.ENDPOINT_URL ;
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
               //console.log(session)
               the_session = session;
               the_session.browse("RootFolder", function(err, browseResult) {
                // if (!err) {
                //   console.log("Browsing rootfolder: ", browseResult.references);
                //   for (let reference of browseResult.references) {
                //     console.log(reference.browseName, reference.nodeId);
                //   }
                // }
                callback(err);
              });
               //callback();
             });
           },
//writing variables
function(callback) {
  var max_age = 0;
      var nodesToWrite = [{
           nodeId: "ns=1;s=AlarmNode1",
           attributeId: AttributeIds.Value,
           indexRange: null,
           value: { 
               value: { 
                   dataType: DataType.Double,
                    value: 34
               }
         }
  }];
 the_session.write(nodesToWrite, function(err,statusCode,diagnosticInfo) {
      if (!err) {
          console.log("write ok" );
          console.log(diagnosticInfo);
          console.log(statusCode);
      }
      callback(err);
  });  


},
    //reading variables       
           function (callback){ 
           setInterval(() => {
             the_session.read({nodeId: "ns=1;s=AlarmNode1",
             attributeId: AttributeIds.Value}, (err, data)=> {
              if (!err){
                console.log(data);
              }
             })
           }, 10000)
           },
           
         
 ])

// (async () => {
//   await tmpOPCUA()
// })();