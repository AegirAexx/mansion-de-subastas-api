const Schema = require('mongoose').Schema;

module.exports = new Schema({
    artId: { type: Schema.Types.ObjectId, required: true },
    minimumPrice: { type: Number, default: 1000 },
    endDate: { type: Date, required: true },
    // auctionWinner - maybe needs some logic.
    // Should hold the ID of a valid customer that holds the highest bid.
    auctionWinner: { type: Schema.Types.ObjectId },
});
