const EventEmitter = require('events');
const { /*Customer,*/ Auction } = require('../data/db');

class AuctionService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_AUCTIONS: 'GET_ALL_AUCTIONS',
            GET_AUCTION_BY_ID: 'GET_AUCTION_BY_ID',
            GET_AUCTION_WINNER: 'GET_AUCTION_WINNER',
            CREATE_AUCTION: 'CREATE_AUCTION',
            GET_AUCTION_BIDS_WITHIN_AUCTION: 'GET_AUCTION_BIDS_WITHIN_AUCTION',
            PLACE_NEW_BID: 'PLACE_NEW_BID',
            GET_ALL_AUCTIONS_ERROR: 'GET_ALL_AUCTIONS_ERROR',
            GET_AUCTION_BY_ID_ERROR: 'GET_AUCTION_BY_ID_ERROR',
            GET_AUCTION_WINNER_ERROR: 'GET_AUCTION_WINNER_ERROR',
            CREATE_AUCTION_ERROR: 'CREATE_AUCTION_ERROR',
            GET_AUCTION_BIDS_WITHIN_AUCTION_ERROR: 'GET_AUCTION_BIDS_WITHIN_AUCTION_ERROR',
            PLACE_NEW_BID_ERROR: 'PLACE_NEW_BID_ERROR'
        };
    }

    getAllAuctions() {
        Auction.find({}, (err, auctions) => {
            if(err) { this.emit(this.events.GET_ALL_AUCTIONS_ERROR); }
            else { this.emit(this.events.GET_ALL_AUCTIONS, auctions); }
        });
    }

    getAuctionById(id) {
        Auction.findById(id, (err, auction) => {
            if(err) { this.emit(this.events.GET_AUCTION_BY_ID_ERROR); }
            else { this.emit(this.events.GET_AUCTION_BY_ID, auction); }
        });
    }

    getAuctionWinner(/*auctionId*/) {}

    createAuction(/*auction*/) {}

    getAuctionBidsWithinAuction(/*auctionId*/) {}

    placeNewBid(/*auctionId, customerId, price*/) {}
}

module.exports = AuctionService;
