const Schema = require('mongoose').Schema;

module.exports = new Schema({
    title: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now },
    images: { tupe: [ String ] /*, index: true */ },
    description: { type: String },
    isAuctionItem: { type: Boolean, default: false }
});
