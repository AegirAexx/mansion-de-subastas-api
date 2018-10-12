const mongoose = require('mongoose');
const artSchema = require('../schemas/art');
const artistSchema = require('../schemas/artist');
const auctionSchema = require('../schemas/auction');
const auctionBidSchema = require('../schemas/auctionBid');
const customerSchema = require('../schemas/customer');
// const orderSchema = require('../schemas/order');

const connection = mongoose.createConnection('mongodb://aegir:tuX.b00k@ds125713.mlab.com:25713/veft-la2-mds', { useNewUrlParser: true });

module.exports = {
    Art: connection.model('Art', artSchema),
    Artist: connection.model('Artist', artistSchema),
    Auction: connection.model('Auction', auctionSchema),
    AuctionBid: connection.model('AuctionBid', auctionBidSchema),
    Customer: connection.model('Customer', customerSchema),
    // Order: connection.model('Order', orderSchema),
    connection
};
