const EventEmitter = require('events');
const { Customer, AuctionBid } = require('../data/db');
const Mongoose = require('mongoose').Types.ObjectId;

class CustomerService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_CUSTOMERS: 'GET_ALL_CUSTOMERS',
            GET_CUSTOMER_BY_ID: 'GET_CUSTOMER_BY_ID',
            GET_CUSTOMER_AUCTION_BIDS: 'GET_CUSTOMER_AUCTION_BIDS',
            CREATE_CUSTOMER: 'CREATE_CUSTOMER',
            // ERRORS
            GET_ALL_CUSTOMERS_ERROR: 'GET_ALL_CUSTOMERS_ERROR',
            GET_CUSTOMER_BY_ID_ERROR: 'GET_CUSTOMER_BY_ID_ERROR',
            GET_CUSTOMER_BY_ID_NOT_ID_ERROR: 'GET_CUSTOMER_BY_ID_NOT_ID_ERROR',
            GET_CUSTOMER_AUCTION_BIDS_ERROR: 'GET_CUSTOMER_AUCTION_BIDS_ERROR',
            GET_CUSTOMER_AUCTION_BIDS_NOT_ID_ERROR: 'GET_CUSTOMER_AUCTION_BIDS_NOT_ID_ERROR',
            CREATE_CUSTOMER_ERROR: 'CREATE_CUSTOMER_ERROR'
        };
    }

    getAllCustomers() {
        Customer.find({}, (err, customers) => {
            if(err) { this.emit(this.events.GET_ALL_CUSTOMERS_ERROR); }
            else { this.emit(this.events.GET_ALL_CUSTOMERS, customers); }
        });
    }

    getCustomerById(id) {
        Customer.findById(id, (err, customer) => {
            if(err != null){
                if(err.reason == undefined) { this.emit(this.events.GET_CUSTOMER_BY_ID_NOT_ID_ERROR); }
                if(err) { this.emit(this.events.GET_CUSTOMER_BY_ID_ERROR); }
            }else { this.emit(this.events.GET_CUSTOMER_BY_ID, customer); }
        });
    }

    getCustomerAuctionBids(id) {
        AuctionBid.find({ customerId: id }, (err, bids) => {
            if(err != null){
                if(err.reason == undefined) {this.emit(this.events.GET_CUSTOMER_AUCTION_BIDS_NOT_ID_ERROR); }
                if(err) { this.emit(this.events.GET_CUSTOMER_AUCTION_BIDS_ERROR); }
            }
            else {
                this.emit(this.events.GET_CUSTOMER_AUCTION_BIDS, bids);
            }
        });
    }

    // getCustomerAuctionBids(id) {
    //     const that = this;
    //     Customer.find({}, (err, data) => {
    //         if(err) { this.emit(this.events.GET_CUSTOMER_AUCTION_BIDS_ERROR); }
    //         else {
    //             const checker = data.find(c => c._id == id);
    //             if(checker instanceof Object){
    //                 AuctionBid.findOne({ 'customerId': id }, (err, auctions) => {
    //                     if(err != null){
    //                         // if(err.reason == undefined){  }
    //                         if(err) { that.emit(that.events.GET_CUSTOMER_AUCTION_BIDS_ERROR); }
    //                     } else { that.emit(that.events.GET_CUSTOMER_AUCTION_BIDS, auctions); }
    //                 });
    //             } else { this.emit(this.events.GET_CUSTOMER_AUCTION_BIDS_NOT_ID_ERROR); }
    //         }
    //     });
    // }

    createCustomer(body) {
        const customer = new Customer({
            name: body.name,
            username: body.username,
            email: body.email,
            address: body.address
        });

        Customer.create(customer, (err) => {
            if(err) { this.emit(this.events.CREATE_CUSTOMER_ERROR); }
            else { this.emit(this.events.CREATE_CUSTOMER); }
        });
    }
}

module.exports = CustomerService;
