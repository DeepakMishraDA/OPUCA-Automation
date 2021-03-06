function addNodes(namespace, device, Variant, DataType) {
    // testNodes.nodes.map(node => {
    //   let nodeVariable = node.startingValue;
  
    //   setInterval(() => {
    //     nodeVariable += 2 * node.halfSecondIncrease;
    //   }, 1000);
    const nodeVariable2 = 5;
      namespace.addVariable({

        componentOf: device,
    
        nodeId: "ns=1;b=1020FFAA", // some opaque NodeId in namespace 4
    
        browseName: "MyVariable2",
    
        dataType: "Double",    
    
        value: {
            get: () => new Variant({dataType: DataType.Double, value: nodeVariable2 }),
            set: (variant) => {
                variable2 = parseFloat(variant.value);
                return StatusCodes.Good;
            }
        }
    });
    //});
  }

module.exports = addNodes