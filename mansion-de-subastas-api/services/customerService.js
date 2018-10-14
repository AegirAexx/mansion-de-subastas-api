const EventEmitter = require('events');
const { Customer /* , Auction */ } = require('../data/db');

class CustomerService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_CUSTOMERS: 'GET_ALL_CUSTOMERS',
            GET_CUSTOMER_BY_ID: 'GET_CUSTOMER_BY_ID',
            GET_CUSTOMER_AUCTION_BIDS: 'GET_CUSTOMER_AUCTION_BIDS',
            CREATE_CUSTOMER: 'CREATE_CUSTOMER',
            GET_ALL_CUSTOMERS_ERROR: 'GET_ALL_CUSTOMERS_ERROR',
            GET_CUSTOMER_BY_ID_ERROR: 'GET_CUSTOMER_BY_ID_ERROR',
            GET_CUSTOMER_BY_ID_NOT_ID_ERROR: 'GET_CUSTOMER_BY_ID_NOT_ID_ERROR',
            GET_CUSTOMER_AUCTION_BIDS_ERROR: 'GET_CUSTOMER_AUCTION_BIDS_ERROR',
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

    getCustomerAuctionBids(/*customerId*/) {
        // Needs more connections to make the query.
    }

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
