// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Property is ERC721 {
    uint256 public cost = 5 ether;
    uint256 public maxSupply = 3;
    uint256 public totalSupply = 0;

    struct Building {
        string name;
        address owner;
        string streetName;
        string postcode;
    }

    Building[] public buildings;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        cost = _cost;


        buildings.push(Building('Rosedale House', address(0x0), 'Elm Street', 'E31 0PB'));
        buildings.push(Building('Oakview', address(0x0), 'Elderberry Lane', 'WC2 1FL'));
        buildings.push(Building('Coxes Meadow', address(0x0), 'Queen Street', 'WB7 3SE'));
    }

    function mint(uint256 _id) public payable {
        uint256 supply = totalSupply;
        require(supply <= maxSupply);
        require(buildings[_id - 1].owner == address(0x0));
        require(msg.value >= cost);

        buildings[_id - 1].owner = msg.sender;
        totalSupply = totalSupply + 1;

        _safeMint(msg.sender, _id);
    }

    function getBuildings() public view returns (Building[] memory) {
        return buildings;
    }

    function getBuilding(uint256 _id) public view returns (Building memory) {
        return buildings[_id - 1];
    }
}