const EventEmitter = require('events');
const { Customer, Auction, AuctionBid } = require('../data/db');
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
            GET_AUCTION_WINNER_NOT_ID_ERROR: 'GET_AUCTION_WINNER_NOT_ID_ERROR',
            GET_AUCTION_WINNER_NOT_FINISHED_ERROR: 'GET_AUCTION_WINNER_NOT_FINISHED_ERROR',
            GET_AUCTION_WINNER_NO_BIDS_ERROR: 'GET_AUCTION_WINNER_NO_BIDS_ERROR',
            CREATE_AUCTION_ERROR: 'CREATE_AUCTION_ERROR',
            CREATE_AUCTION_NO_ART_ERROR: 'CREATE_AUCTION_NO_ART_ERROR',
            CREATE_AUCTION_ART_NOT_AUCTION_ITEM_ERROR: 'CREATE_AUCTION_ART_NOT_AUCTION_ITEM_ERROR',
            GET_AUCTION_BIDS_WITHIN_AUCTION_ERROR: 'GET_AUCTION_BIDS_WITHIN_AUCTION_ERROR',
            GET_AUCTION_BIDS_WITHIN_AUCTION_NOT_ID_ERROR: 'GET_AUCTION_BIDS_WITHIN_AUCTION_NOT_ID_ERROR',
            PLACE_NEW_BID_ERROR: 'PLACE_NEW_BID_ERROR',
            PLACE_NEW_BID_NOT_AUCTION_ID_ERROR: 'PLACE_NEW_BID_NOT_AUCTION_ID_ERROR',
            PLACE_NEW_BID_NOT_CORRECT_BID_ERROR: 'PLACE_NEW_BID_NOT_CORRECT_BID_ERROR',
            PLACE_NEW_BID_DATE_PASSED_ERROR: 'PLACE_NEW_BID_DATE_PASSED_ERROR',
            PLACE_NEW_BID_NOT_CUSTOMER_ID_ERROR: 'PLACE_NEW_BID_NOT_CUSTOMER_ID_ERROR'
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

    getAuctionWinner(id) {
        const that = this;

        AuctionBid.countDocuments({ auctionId: id }).exec((err, bidCount) => {
            if(err) { this.emit(this.events.GET_AUCTION_WINNER_ERROR); }
            else {
                Auction.findById(id, (err, auction) => {
                    if(err != null){
                        if(err.reason == undefined) { that.emit(that.events.GET_AUCTION_WINNER_NOT_ID_ERROR); }
                        if(err) { that.emit(that.events.GET_AUCTION_WINNER_ERROR); }
                    } else if (auction.endDate >= Date.now) {
                        that.emit(that.events.GET_AUCTION_WINNER_NOT_FINISHED_ERROR);
                    } else if (bidCount === 0) {
                        that.emit(that.events.GET_AUCTION_WINNER_NO_BIDS_ERROR);
                    } else {
                        Customer.findById(auction.auctionWinner, (err, customer) => {
                            if(err) { that.emit(that.events.GET_AUCTION_WINNER_ERROR); }
                            else { that.emit(that.events.GET_AUCTION_WINNER, customer); }
                        });
                    }
                });
            }
        });
    }

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

        artService.on('GET_ALL_ARTS_ERROR', () => this.emit(this.events.CREATE_AUCTION_ERROR));

        artService.getAllArts();
    }

    getAuctionBidsWithinAuction(id) {
        AuctionBid.find({ auctionId: id}, (err, bids) => {
            if(err != null){
                if(err == undefined) { this.emit(this.events.GET_AUCTION_BIDS_WITHIN_AUCTION_NOT_ID_ERROR); }
                if(err) { this.emit(this.events.GET_AUCTION_BIDS_WITHIN_AUCTION_ERROR); }
            } else { this.emit(this.events.GET_AUCTION_BIDS_WITHIN_AUCTION, bids); }
        });
    }

    placeNewBid(id, body) {
        const that = this;
        AuctionBid.findOne({auctionId: id}).sort('-price').exec( (err, currentHighest) => {
            if(err != null) {
                if(err.reason == undefined) { that.emit(that.events.PLACE_NEW_BID_NOT_AUCTION_ID_ERROR); }
                if(err) { that.emit(that.events.PLACE_NEW_BID_ERROR); }
            }
            else {
                Auction.findById(id, (err, auction) => {
                    if(err) { 
                        that.emit(that.events.PLACE_NEW_BID_ERROR); 
                    }
                    else {
                        if(typeof body.price != 'number') {
                            that.emit(that.events.PLACE_NEW_BID_NOT_CORRECT_BID_ERROR);
                            return;
                        }
                        if (currentHighest != null) {
                            if(body.price <= auction.minimumPrice || body.price <= currentHighest.price) {
                                that.emit(that.events.PLACE_NEW_BID_NOT_CORRECT_BID_ERROR);
                                return;
                            }
                        }
                        if (currentHighest == null) {
                            if(body.price <= auction.minimumPrice) {
                                that.emit(that.events.PLACE_NEW_BID_NOT_CORRECT_BID_ERROR);
                                return;
                            }
                        }
                        if(auction.endDate > Date.now) {
                            that.emit(that.events.PLACE_NEW_BID_DATE_PASSED_ERROR);
                            return;
                        }
                        Customer.findById(body.customerId, err => {
                            if(err != null) {
                                if(err.reason == undefined) { that.emit(that.events.PLACE_NEW_BID_NOT_CUSTOMER_ID_ERROR); }
                                if(err) { that.emit(that.events.PLACE_NEW_BID_ERROR); }
                            }
                            else {
                                Auction.findOneAndUpdate({ '_id': id }, { $set: {  'auctionWinner': body.customerId } }, err => {
                                    if(err) { that.emit(that.events.PLACE_NEW_BID_ERROR); }
                                    else {
                                        const bid = new AuctionBid({
                                            auctionId: id,
                                            customerId: body.customerId,
                                            price: body.price
                                        });
                                        
                                        AuctionBid.create(bid, err => {
                                            if(err) { that.emit(that.events.PLACE_NEW_BID_ERROR); }
                                            else { that.emit(that.events.PLACE_NEW_BID); }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = AuctionService;
