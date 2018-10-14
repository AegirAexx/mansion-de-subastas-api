const EventEmitter = require('events');
const { Art } = require('../data/db');
const ArtistService = require('./artistService');

class ArtService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_ARTS: 'GET_ALL_ARTS',
            GET_ART_BY_ID: 'GET_ART_BY_ID',
            CREATE_ART: 'CREATE_ART',
            // ERRORS
            GET_ALL_ARTS_ERROR: 'GET_ALL_ARTS_ERROR',
            GET_ART_BY_ID_ERROR: 'GET_ART_BY_ID_ERROR',
            GET_ART_BY_ID_NOT_ID_ERROR: 'GET_ART_BY_ID_NOT_ID_ERROR',
            CREATE_ART_ERROR: 'CREATE_ART_ERROR',
            CREATE_ART_NO_ARTIST_ERROR: 'CREATE_ART_NO_ARTIST_ERROR'
        };
    }

    getAllArts() {
        Art.find({}, (err, arts) => {
            if(err) { this.emit(this.events.GET_ALL_ARTS_ERROR); }
            else { this.emit(this.events.GET_ALL_ARTS, arts); }
        });
    }

    getArtById(id) {
        Art.findById(id, (err, art) => {
            if(err != null){
                if(err.reason == undefined) { this.emit(this.events.GET_ART_BY_ID_NOT_ID_ERROR); }
                if(err) { this.emit(this.events.GET_ART_BY_ID_ERROR); }
            }
            else { this.emit(this.events.GET_ART_BY_ID, art); }
        });
    }

    createArt(body) {
        const artistService = new ArtistService();
        const artistId = body.artistId;
        const that = this;
        artistService.on('GET_ALL_ARTISTS', data => {
            const checker = data.find(a => a._id == artistId);
            if(checker instanceof Object) {
                const art = new Art({
                    title: body.title,
                    artistId: body.artistId,
                    images: body.images,
                    description: body.description,
                    isAuctionItem: body.isAuctionItem
                });

                Art.create(art, (err) => {
                    if(err) { that.emit(that.events.CREATE_ART_ERROR); }
                    else { that.emit(that.events.CREATE_ART); }
                });
            } else { that.emit(that.events.CREATE_ART_NO_ARTIST_ERROR); }
        });

        artistService.on('GET_ALL_ARTIST_ERROR', () => that.emit(that.events.CREATE_ART_ERROR));

        artistService.getAllArtists();
    }
}

module.exports = ArtService;
