const { OPCUAClient, makeBrowsePath, AttributeIds, DataType, StatusCodes} = require("node-opcua");
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
function (callback) {
  //var setPointTemperatureId = "ns=1;s=AlarmNode1";
  let nodeToWrite = {
    nodeId: "ns=1;s=AlarmNode1",
    attributeIds:AttributeIds.Value,
    value: /* DataValue */ {
        sourceTimestamp: new Date(),
        statusCode: StatusCodes.Good,// <==== 
        value: /* Variant */ {
             dataType: DataType.Int32,
             value: 25
        }
    },
}

the_session.write(nodeToWrite);
the_session.read({nodeId: "ns=1;s=AlarmNode1"}).then((data)=>{
console.log(data)
}
)
},
    //reading variables       
          //  function (callback){ 
          //  setInterval(() => {
          //    the_session.read({nodeId: "ns=1;s=AlarmNode1",
          //    attributeId: AttributeIds.Value}, (err, data)=> {
          //     if (!err){
          //       console.log(data);
          //     }
          //    })
          //  }, 5000)
          //  },
           
         
 ])

// (async () => {
//   await tmpOPCUA()
// })();