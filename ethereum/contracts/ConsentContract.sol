pragma solidity ^0.5.7;

/// @author Michael Smith, Evan Steiner, Ezra Huston
/// @title A simple consent-saving contract
// gas limit: minimum of 3148090 to deploy contract
contract ConsentContract {
	enum ContractState { DoesNotExist, Initialized, Finalized }

	struct Party {
    	ContractState state;
    	uint256 startTime;
    	address owner;
    	uint256 maxUsersPermitted;
    	mapping(uint256 => ConsentingUser) consentingUsers;
    	uint256 guestsInParty;
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
	mapping(address => Profile) profiles;


	// constructor function
	constructor() public {}


	// fallback function
	function() external {}


	modifier profileDoesNotExistModifier {
	    require(
        	profileDoesNotExist(),
        	"You have already created a profile"
    	);
    	_;
	}

	modifier profileExistsModifier {
	    require(
        	!profileDoesNotExist(),
        	"You must first create a profile"
    	);
    	_;
	}

	modifier notStringEmptyModifier(string memory inputString) {
	    require(
	        notStringEmpty(inputString),
	        "String cannot be empty"
	    );
	    _;
	}

	modifier partyDoesNotExistModifier(string memory partyName) {
    	require(
        	partyDoesNotExist(partyName),
        	"Party is already created"
    	);
    	_;
	}

	modifier partyInitializedModifier(string memory partyName) {
    	require(
        	partyInitialized(partyName),
        	"Party is not in the Initialized state"
    	);
    	_;
	}

	modifier partyOwnerModifier(string memory partyName) {
    	require(
        	partyOwner(partyName),
        	"You must be the party's creator to access"
    	);
    	_;
	}

	modifier notPartyOwnerModifier(string memory partyName) {
    	require(
        	!partyOwner(partyName),
        	"Party creator cannot be added as a guest"
    	);
    	_;
	}

	modifier notYetAddedToPartyModifier(string memory partyName) {
	    require(
            notYetAddedToParty(partyName),
        	"You are already in the party"
    	);
    	_;
	}

	// Step 0.
	//  Create a profile with:
	//  - first name.
	//  - last name.
	function createProfile(string memory fName, string memory lName)
    	public
    	profileDoesNotExistModifier
    	notStringEmptyModifier(fName)
    	notStringEmptyModifier(lName)
	{
    	Profile storage currUser = profiles[msg.sender];

    	currUser.firstName = fName;
    	currUser.lastName = lName;
    	currUser.timeCreated = now;
	}

	// Step 1a.
	//   Alice creates the party with:
	//   - default closeTime of 5 minutes.
	//   - default maxGuests of 1.
	function createParty1A(string memory partyName)
    	public
    	profileExistsModifier
    	notStringEmptyModifier(partyName)
    	partyDoesNotExistModifier(partyName)
	{
    	Party storage party1a = parties[partyName];

    	party1a.state = ContractState.Initialized;
    	party1a.startTime = now;
    	party1a.owner = msg.sender;

    	party1a.closeTime = party1a.startTime + 5 minutes; // now + 5 minutes
    	party1a.maxUsersPermitted = 1;
	}

	// Step 1b.
	//   Alice creates the party with:
	//   - a specified closeTime of x (in minutes).
	//   - default maxGuests of 1.
	function createParty1B(string memory partyName, uint256 closeTimeInMinutes)
    	public
    	profileExistsModifier
    	notStringEmptyModifier(partyName)
    	partyDoesNotExistModifier(partyName)
	{
    	Party storage party1b = parties[partyName];

    	party1b.state = ContractState.Initialized;
    	party1b.startTime = now;
    	party1b.owner = msg.sender;

    	party1b.closeTime = party1b.startTime + (closeTimeInMinutes * 1 minutes); // now + x minutes.
    	party1b.maxUsersPermitted = 1;
	}

	// Step 1c.
	//  Alice creates the party with:
	//  - default closeTime of 5 minutes.
	//  - a max of y number of guests permitted.
	function createParty1C(string memory partyName, uint256 maxNumberOfGuests)
    	public
    	profileExistsModifier
    	notStringEmptyModifier(partyName)
    	partyDoesNotExistModifier(partyName)
	{
    	Party storage party1c = parties[partyName];

    	party1c.state = ContractState.Initialized;
    	party1c.startTime = now;
    	party1c.owner = msg.sender;

    	party1c.closeTime = party1c.startTime + 5 minutes; // now + 5 minutes
    	party1c.maxUsersPermitted = maxNumberOfGuests;
	}

	// Step 1d=(1b & 1c).
	//  Alice creates the party with:
	//  - a specified closeTime of x (in minutes).
	//  - a max of y number of guests permitted.
	function createParty1D(string memory partyName, uint256 closeTimeInMinutes, uint256 maxNumberOfGuests)
    	public
    	profileExistsModifier
    	notStringEmptyModifier(partyName)
    	partyDoesNotExistModifier(partyName)
	{
    	Party storage party1d = parties[partyName];

    	party1d.state = ContractState.Initialized;
    	party1d.startTime = now;
    	party1d.owner = msg.sender;

    	party1d.closeTime = party1d.startTime + (closeTimeInMinutes * 1 minutes);
    	party1d.maxUsersPermitted = maxNumberOfGuests;
	}

	// Step 2.
	//  Alice invites Bob to join the party by sending the partyName string.

	// Step 3.
	//  Bob joins the party (consents to party).
	function addGuestToParty(string memory partyName)
    	public
    	profileExistsModifier
    	notStringEmptyModifier(partyName)
    	partyInitializedModifier(partyName)
    	notPartyOwnerModifier(partyName)
    	notYetAddedToPartyModifier(partyName)
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
    	notStringEmptyModifier(partyName)
    	partyInitializedModifier(partyName)
    	partyOwnerModifier(partyName)
	{
	    Party storage party4 = parties[partyName];
    	ConsentingUser storage partyCreator = party4.consentingUsers[party4.guestsInParty++];

    	partyCreator.timeAdded = now;
    	partyCreator.userAddress = msg.sender;

    	party4.state = ContractState.Finalized;
    	party4.closeTime = now;
	}

	// Step 4b.
	//  Alice cancels her consent.
	//  - party is finalized.
	function ownerCancels(string memory partyName)
    	public
    	notStringEmptyModifier(partyName)
    	partyInitializedModifier(partyName)
    	partyOwnerModifier(partyName)
	{
    	Party storage party4 = parties[partyName];

    	party4.state = ContractState.Finalized;
    	party4.closeTime = now;
	}

	function profileDoesNotExist()
	    public
	    view
	    returns (bool)
	{
	    Profile memory profile = profiles[msg.sender];

	    if (bytes(profile.firstName).length == 0)
        	if (bytes(profile.lastName).length == 0)
        	    if (profile.timeCreated == 0)
        	        return true;
    	return false;
	}

	function partyDoesNotExist(string memory partyName)
	    public
	    view
	    returns (bool)
	{
	    return (parties[partyName].state == ContractState.DoesNotExist);
	}

	function partyInitialized(string memory partyName)
	    public
	    view
	    returns (bool)
	{
	    return (parties[partyName].state == ContractState.Initialized);
	}

	function partyOwner(string memory partyName)
	    public
	    view
	    returns (bool)
	{
	    return (parties[partyName].owner == msg.sender);
	}

	function notYetAddedToParty(string memory partyName)
	    public
	    view
	    returns (bool)
	{
	    return (parties[partyName].added[msg.sender] != true);
	}

	function notStringEmpty(string memory inputString)
	    public
	    pure
	    returns (bool)
	{
	    return (bytes(inputString).length != 0);
	}
}
