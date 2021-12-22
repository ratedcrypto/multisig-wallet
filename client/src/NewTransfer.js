import React, { useState } from 'react';

function NewTransfer({ createTransfer }) {
  const [transfer, setTransfer] = useState(undefined);

  const submit = (e) => {
    e.preventDefault();
    createTransfer(transfer);
  };

  const updateTransfer = (e, field) => {
    const value = e.target.value;
    setTransfer({ ...transfer, [field]: value });
  };

  return (
    <div className="container">
      <h2>Create transfer</h2>
      <form onSubmit={(e) => submit(e)}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="text"
            className="form-control"
            required
            onChange={(e) => updateTransfer(e, 'amount')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="to">To</label>
          <input
            id="to"
            type="text"
            className="form-control"
            required
            onChange={(e) => updateTransfer(e, 'to')}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewTransfer;
