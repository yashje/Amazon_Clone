// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Amazon_Clone {
    address public owner;

    //Struct to create a custom type for productList
    struct items {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint stock;
    }

    //Struct to crete order
    struct order {
        uint256 time;
        items Items;
    }

    //mapping to create a key value pair of the
    //product-id and product details
    mapping(uint256 => items) public Item;
    mapping(address => mapping(uint256 => order)) public orders;
    mapping(address => uint256) public ordercount;

    event Buy(address buyer, uint256 orderId, uint256 itemId);
    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //productList function that
    // use to create a product and deploy to blockchain
    function productList(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint _stock
    ) public onlyOwner {
        items memory Items = items(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );

        Item[_id] = Items;

        emit List(_name, _cost, _stock);
    }

    //buyer function
    function buy(uint256 _id) public payable {
        //fetch item
        items memory Items = Item[_id];

        //check we have enough ETH
        require(msg.value >= Items.cost);

        //check if items are available
        require(Items.stock > 0);

        //create a order
        order memory Order = order(block.timestamp, Items);

        //save order to chain
        ordercount[msg.sender]++;
        orders[msg.sender][ordercount[msg.sender]] = Order;

        //substract stock
        Item[_id].stock = Items.stock - 1;

        //Emit event
        emit Buy(msg.sender, ordercount[msg.sender], Items.id);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
