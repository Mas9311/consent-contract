# Cover Your Assets

<p align="center">
  <img src="../Mas9311-assets-control_flow/CYA_Logo_Zoomed.png"
       align="center"
       alt="Cover Your Assets logo"
       height="120" />
</p>

Solidity smart contract that saves consent to the rinkeby testnet.<br>
Check out the demo on [YouTube](https://youtu.be/5w58uCK--1c).

## Usage

 1. Alice and Bob create their accounts using their first and last name.
 1. Alice inputs a party name as a string and creates the party "ThisIsMyPartyName".
 1. Alice informs Bob to join the party.
 1. Bob joins the party provided.

When creating a party, the creator is given the option to include:
 - The maximum number of guests permitted to join (excluding the creator).
 - A time limit when the party will expire.

When the last guest joins the party, the party is set to a finalized state.

### Run Requirements:

 - <code>npm i</code> to install all required packages to the project's directory.
 - <code>truffle compile</code> to compile the Solidity contract.
 - <code>npm start</code> to start the UI in browser.
 
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br>
The page will reload if you make edits to any of the javascript files in _./src/_.<br>

### `npm test`

Requirements: ganache-cli
 - <code>npm i -g ganache-cli</code> to install globally.

 1. In a Terminal window, run <code>ganache-cli</code> to create 10 local pseudo-accounts.
 1. In a separate terminal window, run <code>truffle migrate</code> to deploy the contract to ganache.
 1. Once migrated, run <code>truffle test</code> to initiate the test cases.<br>
