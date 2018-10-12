// Large Assignment 2 | SC-T-514-VEFT @ Reykjavik University
// Aegir Tomasson @aegir15

const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;
const bodyParser = require('body-parser');
const ArtistService = require('./services/artistService');
// const ArtService = require('./service/artService');
// const AuctionService = require('./service/auctionService');
// const CustomerService = require('./service/customerService');

// Get all arts.
router.get('/arts', (req, res) => {
    // return res.json(ArtService.getAllArts());
    return res.send('All the arts...');
});

// Get art by id.
router.get('/arts/:id', (req, res) => {
    const { id } = req.params;
    return res.send(`The id: ${id} was requested!`);
});

// Create art.
router.post('/arts', (req, res) => {
    const { body } = req;
    return res.status(204).json(body);
});

// Get all artists.
router.get('/artists', (req, res) => {
    const artistService = new ArtistService();

    artistService.on('GET_ALL_ARTISTS', (data) => {
       return res.json(data).end();
    });

    artistService.on('GET_ALL_ARTISTS_ERROR', (data) => {
        return res.status(500).end();
    });

    artistService.getAllArtists();
});

// Get artist by id.
router.get('/artists/:id', (req, res) => {
    const { id } = req.params;
    const artistService = new ArtistService();

    artistService.on('GET_ARTIST_BY_ID', (data) => {
        return res.json(data).end();
    });

    artistService.on('GET_ARTIST_BY_ID_ERROR', (data) => {
        return res.status(500).end();
    });

    artistService.getArtistById(id);
});

// Create artist.
router.post('/artists', (req, res) => {
    const { body } = req;
    const artistService = new ArtistService();

    artistService.on('CREATE_ARTIST', (data) => {
        return res.status(201).end();
    });

    artistService.on('CREATE_ARTIST_ERROR', (data) => {
        return res.status(500).end();
    });

    artistService.createArtist(body);
});

// Get all the customers.
router.get('/customers', (req, res) => {
    return res.send(`All the customers...`);
});

// Get a customer by id.
router.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    return res.send(`The id: ${id} was requested!`);
});

// Create a customer.
router.post('/customers', (req, res) => {
    const { body } = req;
    return res.status(204).json(body);
});

// Get all auction bide associated with a customer.
router.get('/customers/:id/auction-bids', (req, res) => {
    const { id } = req.params;
    return res.send(`The id: ${id} was requested!`);
});

// Get all auctions.
router.get('/auctions', (req, res) => {
    return res.send(`All the auctions...`);
});

// Get an auction by id.
router.get('/auctions/:id', (req, res) => {
    const { id } = req.params;
    return res.send(`The id: ${id} was requested!`);
});

// Get the winner of the auction.
router.get('/auctions/:id/winner', (req, res) => {
    const { id } = req.params;
    return res.send(`The id: ${id} was requested!`);
});

// Create a new auction.
router.post('/auctions', (req, res) => {
    const { body } = req;
    return res.status(204).json(body);
});

// Get all auction bids associated with an auction.
router.get('/auctions/:id/bids', (req, res) => {
    const { id } = req.params;
    return res.send(`The id: ${id} was requested!`);
});

// Create a new auction bid.
router.post('/auctions/:id/bids', (req, res) => {
    const { body } = req;
    return res.status(204).json(body);
});

app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Port ${port}...`);
});