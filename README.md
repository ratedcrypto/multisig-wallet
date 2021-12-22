# multisig-wallet

[Live demo](https://inspiring-heyrovsky-f16936.netlify.app/)

## To deploy smart contract on local

```
truffle develop
migrate --reset
```

## To run smart contract tests
```
truffle test
```

## To deploy smart contract on testnet (Kovan)

### Secrets

Create .secrets.json file on root level and specify private keys of testnet (kovan) addresses and respected infura url
```
{
  "privateKeys": [
    "pk1",
    "pk2",
    "pk3",
    "pk4"
  ],
  "infuraKovanEndpoint": "https://kovan.infura.io/vX/xxxx"
}

```

### Deploy contract 

```
truffle migrate --reset --network kovan
```
