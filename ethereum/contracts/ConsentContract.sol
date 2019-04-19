pragma solidity ^0.5.6;

/// @author Michael Smith, Evan Steiner, Ezra Huston
/// @title A simple consent-saving contract
// gas limit: minimum of 3327091 to deploy contract
contract ConsentContract {
	enum ContractState { DoesNotExist, Initialized, Finalized }
    	
	struct Party {
    	ContractState state;
    	uint256 startTime;
    	address owner;
    	uint16 maxUsersPermitted;
    	mapping(uint128 => ConsentingUser) consentingUsers;
    	uint16 guestsInParty;
    	mapping(address => bool) added;
    	uint256 closeTime;
	}
	
	struct ConsentingUser {
    	address userAddress;
    	uint256 timeAdded;
	}
	
	struct Profile {
		string firstName;
		string lastName;
    	uint256 timeCreated;
	}
	
	mapping(string => Party) parties;
	mapping(address => string) partyContractNotFinalized;
	mapping(address => Profile) profiles;
	
	modifier profileDoesNotExist {
	    Profile memory profile = profiles[msg.sender];
	    require(
        	(bytes(profile.firstName).length == 0) &&
        	(bytes(profile.lastName).length == 0) &&
        	(profile.timeCreated == 0),
        	"You have already created a profile"
    	);
    	_;
	}
	
	modifier profileExists {
	    Profile memory profile = profiles[msg.sender];
	    require(
        	(bytes(profile.firstName).length != 0) &&
        	(bytes(profile.lastName).length != 0) &&
        	(profile.timeCreated != 0),
        	"You must create a profile first"
    	);
    	_;
	}
	
	modifier stringNotEmpty(string memory inputString) {
	    require(
	        bytes(inputString).length != 0,
	        "String cannot be empty"
	    );
	    _;
	}
	
	modifier partyDoesNotExist(string memory partyName) {
    	require(
        	parties[partyName].state == ContractState.DoesNotExist,
        	"Party is already created"
    	);
    	_;
	}
	
	modifier partyInitialized(string memory partyName) {
    	require(
        	parties[partyName].state == ContractState.Initialized,
        	"Party is not in the Initialized state"
    	);
    	_;
	}
    
	modifier partyOwner(string memory partyName) {
    	require(
        	parties[partyName].owner == msg.sender,
        	"You must be the party's creator to access"
    	);
    	_;
	}
    
	modifier notPartyOwner(string memory partyName) {
    	require(
        	parties[partyName].owner != msg.sender,
        	"Party creator cannot be added as a guest"
    	);
    	_;
	}
	
	modifier notYetAddedToParty(string memory partyName) {
	    require(
            parties[partyName].added[msg.sender] != true,
        	"You are already in the party"
    	);
    	_;
	}
    
	modifier valid16BitRange(uint16 integerProvided) {
	    require(
        	(1 <= integerProvided) && (integerProvided <= 65535),  // [0, 2^16 - 1], but deny 0
        	"Valid integers ranges between 1 an 65535 inclusive"
    	);
    	_;
	}
	
	modifier valid8BitRange(uint8 integerProvided) {
	    require(
        	(1 <= integerProvided) && (integerProvided <= 255),  // [0, 2^8 - 1], but deny 0
        	"Valid integers is between 1 an 255 inclusive"
    	);
    	_;
	}
	
	// constructor function
	constructor() public {}
	
	// fallback function
	function() external {}
	
	// Step 0.
	//  Create a profile with:
	//  - first name.
	//  - last name.
	function createProfile(string memory fName, string memory lName)
    	public
    	profileDoesNotExist
    	stringNotEmpty(fName)
    	stringNotEmpty(lName)
	{
    	Profile storage currUser = profiles[msg.sender];
    	
    	currUser.firstName = fName;
    	currUser.lastName = lName;
    	currUser.timeCreated = now;
	}
	
	// Step 1a.
	//   Alice creates the party with:
	//   - default closeTime of 5 minutes.
	//   - no max party size constraint.
	function createParty(string memory partyName)
    	public
    	profileExists
    	stringNotEmpty(partyName)
    	partyDoesNotExist(partyName)
	{
    	Party storage party1a = parties[partyName];
    	
    	party1a.state = ContractState.Initialized;
    	party1a.startTime = now;
    	party1a.owner = msg.sender;
    	// Not using the maxUsersPermitted to constrain the party size.
    	party1a.closeTime = party1a.startTime + 5 minutes; // now + 5 minutes
    	
    	partyContractNotFinalized[msg.sender] = partyName;
	}
	
	// Step 1b.
	//   Alice creates the party with:
	//   - a specified closeTime of x (in minutes).
	//   - no max party size constraint.
	function createParty(string memory partyName, uint16 closeTimeInMinutes)
    	public
    	profileExists
    	stringNotEmpty(partyName)
    	partyDoesNotExist(partyName)
    	valid16BitRange(closeTimeInMinutes)
	{
    	Party storage party1b = parties[partyName];
    	
    	party1b.state = ContractState.Initialized;
    	party1b.startTime = now;
    	party1b.owner = msg.sender;
    	// Not using the maxUsersPermitted to constrain the party size.
    	party1b.closeTime = party1b.startTime + (closeTimeInMinutes * 1 minutes); // now + x minutes.
	}
	
	// Step 1c.
	//  Alice creates the party with:
	//  - default closeTime of 5 minutes.
	//  - a max of y number of guests permitted.
	function createParty(string memory partyName, uint8 maxNumberOfGuests)
    	public
    	profileExists
    	stringNotEmpty(partyName)
    	partyDoesNotExist(partyName)
    	valid8BitRange(maxNumberOfGuests)
	{
    	Party storage party1c = parties[partyName];
    	
    	party1c.state = ContractState.Initialized;
    	party1c.startTime = now;
    	party1c.closeTime = party1c.startTime + 5 minutes; // now + 5 minutes
    	party1c.maxUsersPermitted = maxNumberOfGuests;
    	party1c.owner = msg.sender;
	}
	
	// Step 1d=(1b & 1c).
	//  Alice creates the party with:
	//  - a specified closeTime of x (in minutes).
	//  - a max of y number of guests permitted.
	function createParty(string memory partyName, uint16 closeTimeInMinutes, uint8 maxNumberOfGuests)
    	public
    	profileExists
    	stringNotEmpty(partyName)
    	partyDoesNotExist(partyName)
    	valid16BitRange(closeTimeInMinutes)
    	valid8BitRange(maxNumberOfGuests)
	{
    	Party storage party1d = parties[partyName];
    	
    	party1d.state = ContractState.Initialized;
    	party1d.startTime = now;
    	party1d.closeTime = party1d.startTime + closeTimeInMinutes * 1 minutes; // now + 5 minutes
    	party1d.owner = msg.sender;
	}
	
	// Step 2.
	//  Alice invites Bob to join the party by sending the partyName string.
	
	// Step 3.
	//  Bob joins the party (consents to party).
	function addGuestToParty(string memory partyName)
    	public
    	profileExists
    	stringNotEmpty(partyName)
    	partyInitialized(partyName)
    	notPartyOwner(partyName)
    	notYetAddedToParty(partyName)
	{
    	Party storage party3 = parties[partyName];
    	ConsentingUser storage guest = party3.consentingUsers[party3.guestsInParty++];
    	
    	guest.timeAdded = now;
    	guest.userAddress = msg.sender;
    	party3.added[msg.sender] = true;
	}
	
	// Step 4a.
	//  Alice consents to the party.
	//  - party is finalized.
	function ownerConsents(string memory partyName)
    	public
    	stringNotEmpty(partyName)
    	partyInitialized(partyName)
    	partyOwner(partyName)
	{
	    Party storage party4 = parties[partyName];
    	ConsentingUser storage partyCreator = party4.consentingUsers[party4.guestsInParty++];
    	
    	partyCreator.timeAdded = now;
    	partyCreator.userAddress = msg.sender;
    	
    	party4.state = ContractState.Finalized;
    	party4.closeTime = now;
    	delete(partyContractNotFinalized[msg.sender]);
	}
	
	// Step 4b.
	//  Alice cancels her consent.
	//  - party is finalized.
	function ownerCancels(string memory partyName)
    	public
    	stringNotEmpty(partyName)
    	partyInitialized(partyName)
    	partyOwner(partyName)
	{
    	Party storage party4 = parties[partyName];
    	
    	party4.state = ContractState.Finalized;
    	party4.closeTime = now;
    	delete(partyContractNotFinalized[msg.sender]);
	}
}
