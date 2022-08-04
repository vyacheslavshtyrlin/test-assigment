export const nodes: any = {
  FirstObject: {
    input: {},
    output: {
      firstObjectClass1: {
        arrow1: [
          {
            attribute: "arrow1",
            targetClass: "firstObjectClass1",
            targetObject: "FirstObject",
            type: "int",
          },
        ],
        arrow2: [
          {
            attribute: "arrow2",
            targetClass: "firstObjectClass1",
            targetObject: "FirstObject",
            type: "int",
          },
        ],
      },
    },
  },
  SecondObject: {
    input: {
      secondObjectClass1: {
        arrow0: [
          {
            attribute: "arrow1",
            sourceClass: "firstObjectClass1",
            sourceObject: "FirstObject",
            type: "int",
          },
          {
            attribute: "arrow2",
            sourceClass: "firstObjectClass1",
            sourceObject: "FirstObject",
            type: "int",
          },
        ],
      },
    },
    ouput: {},
  },
};

export const links: any = {
  "1": {
    output: {
      Node: "FirstObject",
      Class: "firstObjectClass1",
      Attribute: "arrow1",
    },
    input: {
      Node: "SecondObject",
      Class: "secondObjectClass1",
      Attribute: "arrow0",
    },
  },
  "2": {
    output: {
      Node: "FirstObject",
      Class: "firstObjectClass1",
      Attribute: "arrow2",
    },
    input: {
      Node: "SecondObject",
      Class: "secondObjectClass1",
      Attribute: "arrow0",
    },
  },
};

export default nodes

