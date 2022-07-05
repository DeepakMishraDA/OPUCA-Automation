const { OPCUAServer, Variant, DataType } = require('node-opcua');
const addNodes = require('./nodesOpcaua/nodeOne')
const testNodes = require('../testNodes.json');

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

  addNodes(namespace, device);
  const nodeVariable = 5;
  const alarmNode1 = namespace.addVariable({
    componentOf: device,
    browseName: 'alarmNode1',
    dataType: 'Double',
    nodeId: 'ns=1;s=AlarmNode1', //uuid()
    eventSourceOf: device,
    value: {
      get: () =>
        new Variant({ dataType: DataType.Double, value: nodeVariable }),
    },
  });
  namespace.instantiateExclusiveLimitAlarm('ExclusiveLimitAlarmType', {
    browseName: 'MyExclusiveAlarm',
    conditionSource: device,
    inputNode: alarmNode1,
    lowLowLimit: -10.0,
    lowLimit: 1.0,
    highLimit: 10.0,
    highHighLimit: 100.0,
  });
  setInterval(() => {
    alarmNode1.setValueFromSource({ dataType: DataType.Double, value: 101.0 });
    setTimeout(() => {
      alarmNode1.setValueFromSource({ dataType: DataType.Double, value: 5.0 });
    }, 40000);
  }, 120000);
  await server.start(function () {
    console.log('Server is now listening... (press CTRL-C to stop)');
    // console.log('port ', server.endpoints[0].port)
  });
}

main();
