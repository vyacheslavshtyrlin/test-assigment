import React, { useState, FC, useEffect } from "react";
import "./App.css";
import dataProps from "./propsData";
import Table from "./components/table";

interface ITypes {
  Node: string;
  Class: string;
  Attribute: string;
}

interface ILink {
  output: object;
  input: object;
  id: number;
}

const App: FC = () => {
  const keysOutput = Object.keys(dataProps);
  const keysOutput1 = Object.keys(dataProps.FirstObject.output);
  const keysOutput2 = Object.keys(
    dataProps.FirstObject.output.firstObjectClass1
  );

  const [output, setOutput] = useState<ITypes>({
    Node: "",
    Class: "",
    Attribute: "",
  });

  const [input, setInput] = useState<ITypes>({
    Node: "",
    Class: "",
    Attribute: "",
  });

  const [link, setLink] = useState<any>([]);

  const [button, setButton] = useState<boolean>(false);

  const keysInput = Object.keys(dataProps);
  const keysInput1 = Object.keys(dataProps.SecondObject.input);
  const keysInput2 = Object.keys(
    dataProps.SecondObject.input.secondObjectClass1
  );

  function handleChangeOutput(e: { target: { value: string } }) {
    setOutput({
      Node: e.target.value,
      Class: "",
      Attribute: "",
    });
  }

  function handleChangeOutput1(e: { target: { value: string } }) {
    setOutput({
      Node: output.Node,
      Class: e.target.value,
      Attribute: "",
    });
  }

  function handleChangeOutput2(e: { target: { value: string } }) {
    setOutput({
      Node: output.Node,
      Class: output.Class,
      Attribute: e.target.value,
    });
  }

  function handleChangeInput(e: { target: { value: string } }) {
    setInput({
      Node: e.target.value,
      Class: "",
      Attribute: "",
    });
  }

  function handleChangeInput1(e: { target: { value: string } }) {
    setInput({
      Node: input.Node,
      Class: e.target.value,
      Attribute: "",
    });
  }

  function handleChangeInput2(e: { target: { value: string } }) {
    setInput({
      Node: input.Node,
      Class: input.Class,
      Attribute: e.target.value,
    });
  }

  function filterLink(link: any[]) {
    const obj1 = link.some((i) => {
      return (
        i.input.Node === input.Node &&
        i.input.Class === input.Class &&
        i.input.Attribute === input.Attribute &&
        i.output.Node === output.Node &&
        i.output.Class === output.Class &&
        i.output.Attribute === output.Attribute
      );
    });
    return obj1;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLink([
      {
        id: link.length,
        output: output,
        input: input,
      },
      ...link,
    ]);
    setInput({
      Node: "",
      Class: "",
      Attribute: "",
    });
    setOutput({
      Node: "",
      Class: "",
      Attribute: "",
    });
    setButton(false);
  }

  useEffect(() => {
    if (input.Node && output.Node && input.Class && output.Class) {
      if (input.Node !== output.Node) {
        setButton(true);
      }
    }
    if (link.length >= 1) {
      const test = filterLink(link);
      if (test) {
        setButton(false);
      }
    }
  }, [input, output, link]);

  function deleteLink(id: number) {
    const update = link.filter((i: { id: number }) => i.id !== id);
    setLink(update);
  }
  return (
    <div>
      <div className="form">
        <form className="form__container" onSubmit={handleSubmit}>
          <div className="select__container">
            <div className="select__container_output">
              <select
                defaultValue={""}
                onChange={handleChangeOutput}
                value={output.Node}
              >
                <option value="">Block</option>
                {keysOutput.map((i, index) => (
                  <option value={i} key={index}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                defaultValue={""}
                onChange={handleChangeOutput1}
                value={output.Class}
              >
                <option value="">Subblock</option>
                {keysOutput1.map((i, index) => (
                  <option key={index} disabled={!output.Node} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                defaultValue={""}
                onChange={handleChangeOutput2}
                value={output.Attribute}
              >
                <option value="">Output</option>
                {keysOutput2.map((i, index) => (
                  <option key={index} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="select__container_output">
              <select
                defaultValue={""}
                onChange={handleChangeInput}
                value={input.Node}
              >
                <option value="">Block</option>
                {keysInput.map((i, index) => (
                  <option key={index} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                defaultValue={""}
                onChange={handleChangeInput1}
                value={input.Class}
              >
                <option value="">Subblock</option>
                {keysInput1.map((i, index) => (
                  <option key={index} disabled={!input.Node} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                defaultValue={""}
                onChange={handleChangeInput2}
                value={input.Attribute}
              >
                <option value="">Output</option>
                {keysInput2.map((i, index) => (
                  <option key={index} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="button__add" disabled={!button} type="submit">
            &#43;
          </button>
        </form>
      </div>
      {link.map((l: ILink, index: number) => (
        <Table
          onDelete={deleteLink}
          id={l.id}
          input={l.input}
          output={l.output}
          key={index}
        ></Table>
      ))}
    </div>
  );
};

export default App;
