const EventEmitter = require('events');

class CustomerService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_CUSTOMERS: 'GET_ALL_CUSTOMERS',
            GET_CUSTOMER_BY_ID: 'GET_CUSTOMER_BY_ID',
            GET_CUSTOMER_AUCTION_BIDS: 'GET_CUSTOMER_AUCTION_BIDS',
            CREATE_CUSTOMER: 'CREATE_CUSTOMER'
        };
    }
    getAllCustomers() {
        // Your implementation goes here
        // Should emit a GET_ALL_CUSTOMERS event when the data is available
    };

    getCustomerById(id) {
        // Your implementation goes here
        // Should emit a GET_CUSTOMER_BY_ID event when the data is available
    };

    getCustomerAuctionBids(customerId) {
        // Your implementation goes here
        // Should emit a GET_CUSTOMER_AUCTION_BIDS event when the data is available
    };

    createCustomer(customer) {
        // Your implementation goes here
        // Should emit a CREATE_CUSTOMER event when the data is available
    };
};

module.exports = CustomerService;
