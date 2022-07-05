const { OPCUAServer, Variant, DataType } = require('node-opcua');
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
}