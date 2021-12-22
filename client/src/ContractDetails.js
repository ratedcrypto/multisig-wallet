import React from 'react';

function ContractDetails({ approvers, quorum }) {
  return (
    <div className="container">
      <h2>Contract Details</h2>
      <ul className="list-group">
        <li className="list-group-item">
          <b>Approvers:</b>{' '}
          <p className="list-group-item">{approvers.join(', ')}</p>
        </li>
        <li className="list-group-item">
          <b>Quorum:</b> <p className="list-group-item">{quorum}</p>
        </li>
      </ul>
    </div>
  );
}

export default ContractDetails;
