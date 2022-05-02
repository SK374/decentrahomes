// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Land is ERC721 {
    uint256 public cost = 1 ether;
    uint256 public maxSupply = 5;
    uint256 public totalSupply = 0;
    uint256 public memberCost = 1 ether;

    struct Building {
        string name;
        address owner;
        int256 posX;
        int256 posY;
        int256 posZ;
        uint256 sizeX;
        uint256 sizeY;
        uint256 sizeZ;
    
    }

    struct Member {
        address pubkey;
        string name;
    }

    Building[] public buildings;
    Member[] public members;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _memberCost
    ) ERC721(_name, _symbol) {
        cost = _cost;
        memberCost = _memberCost;

        buildings.push(
            Building("Sports Complex", address(0x0), 0, 0, 0, 10, 10, 10)
        );
        buildings.push(Building("Stadium", address(0x0), 0, 10, 0, 10, 5, 3)
        );
        buildings.push(
            Building("University", address(0x0), 0, -10, 0, 10, 5, 3)
        );
        buildings.push(
            Building("Tech Hub", address(0x0), 10, 0, 0, 5, 25, 5)
        );
        buildings.push(
            Building("Shopping Plaza", address(0x0), -10, 0, 0, 5, 25, 5)
        );
    }

    function mint(uint256 _id) public payable {
        uint256 supply = totalSupply;
        require(supply <= maxSupply);
        require(buildings[_id - 1].owner == address(0x0));
        require(msg.value >= cost);

        // NOTE: tokenID always starts from 1, but our array starts from 0
        buildings[_id - 1].owner = msg.sender;
        totalSupply = totalSupply + 1;

        _safeMint(msg.sender, _id);
    }

    function memberMint(uint256 _id) public payable {
        require(buildings[_id - 1].owner != address(0x0));
        require(msg.value >= memberCost);
        
        _safeMint(msg.sender, _id);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        // Update Building ownership
        buildings[tokenId - 1].owner = to;

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        // Update Building ownership
        buildings[tokenId - 1].owner = to;

        _safeTransfer(from, to, tokenId, _data);
    }

    // Public View Functions
    function getBuildings() public view returns (Building[] memory) {
        return buildings;
    }

    function getBuilding(uint256 _id) public view returns (Building memory) {
        return buildings[_id - 1];
    }

    function getOwnedBuildings(uint256 _id) public view returns (Building memory) {
        require(buildings[_id - 1].owner != address(0x0), "This building is not yet open to members");
        return buildings[_id - 1];             
    }
    
    function addMemberToBuilding(address pubkey, string memory name, Member memory) public payable {
        Member memory newMember = Member(pubkey, name);
        members.push(newMember);
    }

    function getMembers() public view returns (Member[] memory) {
        return members;
    }
    }