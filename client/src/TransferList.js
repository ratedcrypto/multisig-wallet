import React from 'react';

function TransferList({ transfers, approveTransfer }) {
  return (
    <div className="container">
      <h2>Transfers</h2>
      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>Id</th>
            <th>Amount</th>
            <th>To</th>
            <th>Approvers</th>
            <th>Sent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.id}>
              <td>{transfer.id}</td>
              <td>{transfer.amount}</td>
              <td>{transfer.to}</td>
              <td>{transfer.approvers}</td>
              <td>{transfer.sent ? 'yes' : 'no'}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => approveTransfer(transfer.id)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransferList;
