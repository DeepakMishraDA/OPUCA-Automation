const {OPCUAClient} = require('node-opcua');
require('dotenv').config();

const installAlarmMonitoring = require('../alarm_monitor/installing_alarms')

async function clientObject() {
    const client = OPCUAClient.create({
        endpointMustExist: false
});
    client.connect(process.env.ENDPOINT_URL);
    client.on("connected", ()=>{
        console.log("Client has connected!")
    })
    var the_session; 
   client.createSession(async (err, session)=> {
         session.read({nodeId: "ns=4;s=.S01.TLSpo.r_Messwert",
        attributeId: AttributeIds.Value},
        (err, data)=> {
            if (!err){
              console.log("This is it",data.value.value)
            }
        }) 
      });
   
    // const subscription = await session.createSubscription2({
    //     requestedPublishingInterval: 200,
    //   requestedMaxKeepAliveCount: 20,
    //   maxNotificationsPerPublish: 1000,
    //   publishingEnabled: true,
    //   priority: 10,
    // });
    // subscription.then(data=>{
    //     console.log(data)
    // })
}

clientObject().then(data => {
    console.log("this",data);
})