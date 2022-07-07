const {OPCUAClient} = require('node-opcua');
require('dotenv').config();

async function clientObject() {
    const client = OPCUAClient.create({
        endpointMustExist: false
});
    client.connect(process.env.ENDPOINT_URL);
    client.on("connected", ()=>{
        console.log("Client has connected!")
    })
    
    //const session = await client.createSession();
}

clientObject().then(data => {
    console.log("this",data);
}).catch(err=>{
    console.log("Some",err)
})