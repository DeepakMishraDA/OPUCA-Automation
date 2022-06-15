const { OPCUAServer, Variant, DataType, StatusCodes} = require("node-opcua");
const { add } = require("nodemon/lib/rules");

const server = new OPCUAServer({
    port: 4334, // the port of the listening socket of the server
    resourcePath: "/UA/MyLittleServer", 
    buildInfo: {
        productName: "MySampleServer1",
        buildNumber: "7658",
        buildDate: new Date(2014, 5, 2)
    }
   //opc.tcp://<hostname>:4334/UA/MyLittleServer
});

function after_init() {
    var addressSpace = server.engine.addressSpace;
    var nameSpace = addressSpace.getNamespace()
    console.log("OPUCA SERVER RUNNING!")
}

server.initialize(after_init);

