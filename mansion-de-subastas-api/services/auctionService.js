const EventEmitter = require('events');
const { /*Customer,*/ Auction } = require('../data/db');
const ArtService = require('./artService');

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
            // ERRORS
            GET_ALL_AUCTIONS_ERROR: 'GET_ALL_AUCTIONS_ERROR',
            GET_AUCTION_BY_ID_ERROR: 'GET_AUCTION_BY_ID_ERROR',
            GET_AUCTION_BY_ID_NOT_ID_ERROR: 'GET_AUCTION_BY_ID_NOT_ID_ERROR',
            GET_AUCTION_WINNER_ERROR: 'GET_AUCTION_WINNER_ERROR',
            CREATE_AUCTION_ERROR: 'CREATE_AUCTION_ERROR',
            CREATE_AUCTION_NO_ART_ERROR: 'CREATE_AUCTION_NO_ART_ERROR',
            CREATE_AUCTION_ART_NOT_AUCTION_ITEM_ERROR: 'CREATE_AUCTION_ART_NOT_AUCTION_ITEM_ERROR',
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
            if (err != null) {
                if(err.reason == undefined) { this.emit(this.events.GET_AUCTION_BY_ID_NOT_ID_ERROR); }
                if(err) { this.emit(this.events.GET_AUCTION_BY_ID_ERROR); }
            } else { this.emit(this.events.GET_AUCTION_BY_ID, auction); }
        });
    }

    getAuctionWinner(/*auctionId*/) {}

    createAuction(body) {
        const artService = new ArtService();
        const artId = body.artId;
        const that = this;
        artService.on('GET_ALL_ARTS', data => {
            const checker = data.find(a => a._id == artId);
            if(checker instanceof Object) {
                if(checker.isAuctionItem) {
                    const auction = new Auction({
                        artId: body.artId,
                        minimumPrice: body.minimumPrice,
                        endDate: body.endDate
                    });

                    Auction.create(auction, (err) => {
                        if(err) { that.emit(that.events.CREATE_AUCTION_ERROR); }
                        else { that.emit(that.events.CREATE_AUCTION); }
                    });
                } else { that.emit(that.events.CREATE_AUCTION_ART_NOT_AUCTION_ITEM_ERROR); }
            } else { that.emit(that.events.CREATE_AUCTION_NO_ART_ERROR); }
        });

        artService.on('GET_ALL_ARTS_ERROR', () => that.emit(that.events.CREATE_AUCTION_ERROR));

        artService.getAllArts();
    }

    getAuctionBidsWithinAuction(/*auctionId*/) {}

    placeNewBid(/*auctionId, customerId, price*/) {}
}

module.exports = AuctionService;
