pragma solidity ^0.5.7;

contract Migrations {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }
}