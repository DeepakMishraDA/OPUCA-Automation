const { OPCUAServer, Variant, DataType,StatusCodes } = require('node-opcua');
const addNodes = require('./nodesOpcua/nodeOne');

async function main() {
  const server = new OPCUAServer({
    port: 4840,
    resourcePath: '/GreenFusion/TestingOPCUAServer',
  });

  await server.initialize();

  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace.getOwnNamespace();
  addressSpace.installAlarmsAndConditionsService();
  const device = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: 'MyDevice',
    eventSourceOf: addressSpace.rootFolder.objects.server,
  });

  addNodes(namespace, device, Variant,DataType);
  const nodeVariable1 = 5;
  namespace.addVariable({
    componentOf: device,
    browseName: 'alarmNode1',
    dataType: 'Int32',
    nodeId: 'ns=1;s=AlarmNode1', //uuid()
    eventSourceOf: device,
    value: {
      get: () =>
        new Variant({ dataType: DataType.Int32, value: nodeVariable1 }),
      set: (variant) => {
        nodeVariable1 = parseFloat(variant.value);
          return StatusCodes.Good;
      }
    },
    
  });
  // namespace.instantiateExclusiveLimitAlarm('ExclusiveLimitAlarmType', {
  //   browseName: 'MyExclusiveAlarm',
  //   conditionSource: device,
  //   inputNode: alarmNode1,
  //   lowLowLimit: -10.0,
  //   lowLimit: 1.0,
  //   highLimit: 10.0,
  //   highHighLimit: 100.0,
  // });
  // setInterval(() => {
  //   alarmNode1.setValueFromSource({ dataType: DataType.Double, value: 101.0 });
  //   setTimeout(() => {
  //     alarmNode1.setValueFromSource({ dataType: DataType.Double, value: 5.0 });
  //   }, 40000);
  // }, 120000);
   server.start(function () {
    console.log('Server is now listening... (press CTRL-C to stop)');
    // console.log('port ', server.endpoints[0].port)
  });
  const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
console.log(" the primary server endpoint url is ", endpointUrl );
}

main();

