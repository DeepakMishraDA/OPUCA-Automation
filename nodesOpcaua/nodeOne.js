function addNodes(namespace, device) {
    testNodes.nodes.map(node => {
      let nodeVariable = node.startingValue;
  
      setInterval(() => {
        nodeVariable += 2 * node.halfSecondIncrease;
      }, 1000);
  
      namespace.addVariable({
        componentOf: device,
        browseName: node.browseName,
        dataType: 'Double',
        nodeId: node.nodeId,
        value: {
          get: () =>
            new Variant({ dataType: DataType.Double, value: nodeVariable }),
        },
      });
    });
  }

module.exports = addNodes