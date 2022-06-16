const { OPCUAServer, Variant, DataType, StatusCodes} = require("node-opcua");
require('dotenv').config();

const server = new OPCUAServer({
    port: process.env.PORT, // the port of the listening socket of the server
    resourcePath: "/UA/MyLittleServer", 
    buildInfo: {
        productName: "MySampleServer1",
        buildNumber: "7658",
        buildDate: new Date(2014, 5, 2)
    }
   //opc.tcp://<hostname>:port/UA/MyLittleServer
});

function after_init() {
    var addressSpace = server.engine.addressSpace;
    var nameSpace = addressSpace.getNamespace()
    console.log("OPUCA SERVER RUNNING!")
}

server.initialize(after_init);

