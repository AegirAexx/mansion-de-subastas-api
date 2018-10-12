const EventEmitter = require('events');
const { Artist } = require('../data/db');

class ArtistService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_ARTISTS: 'GET_ALL_ARTISTS',
            GET_ARTIST_BY_ID: 'GET_ARTIST_BY_ID',
            CREATE_ARTIST: 'CREATE_ARTIST',
            GET_ALL_ARTISTS_ERROR: 'GET_ALL_ARTISTS_ERROR',
            GET_ARTIST_BY_ID_ERROR: 'GET_ARTIST_BY_ID_ERROR',
            CREATE_ARTIST_ERROR: 'CREATE_ARTISTS_ERROR'
        };
    }

    getAllArtists() {
        Artist.find({}, (err, artists) => {
            if(err) { this.emit(this.events.GET_ALL_ARTISTS_ERROR); }
            else { this.emit(this.events.GET_ALL_ARTISTS, artists); }
        });
    }

    getArtistById(id) {
        Artist.findById(id, (err, artist) => {
            if(err) { this.emit(this.events.GET_ARTIST_BY_ID_ERROR); }
            else { this.emit(this.events.GET_ARTIST_BY_ID, artist); }
        });
    }

    createArtist(body) {
        const artist = new Artist({
            name: body.name,
            nickname: body.nickname,
            address: body.address
        });

        Artist.create(artist, (err) => {
            if(err) { this.emit(this.events.CREATE_ARTIST_ERROR); }
            else { this.emit(this.events.CREATE_ARTIST); }
        });
    }
}

module.exports = ArtistService;
