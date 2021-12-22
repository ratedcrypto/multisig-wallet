import React from 'react';

function Header({ approvers, quorum }) {
  return (
    <header className="navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand mx-auto" href="#">
        Multisig Dapp
      </a>
    </header>
  );
}

export default Header;
