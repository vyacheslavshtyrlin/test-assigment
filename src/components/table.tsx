import React, { FC } from "react";

interface Props {
  output: any;
  input: any;
  id: number;
  onDelete: (id: number) => void;
}

const Table: FC<Props> = ({ output, input, id, onDelete }) => {
  function handleDelete() {
    onDelete(id);
  }
  return (
    <div className="table">
      <span>id:</span>
      <div className="table__container">
        <div className="table__row">
          <div className="table__row_output">
            <span>{id}</span>
            <div className="table__cell">{output.Node}</div>
            <div className="table__cell"> {output.Class}</div>
            <div className="table__cell">{output.Attribute}</div>
          </div>
          <div className="table__row_output">
            <div className="table__cell">{input.Node}</div>
            <div className="table__cell">{input.Class}</div>
            <div className="table__cell">{input.Attribute || "Subblock "} </div>
            <button className="button__close" onClick={handleDelete}>
              &#10006;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
