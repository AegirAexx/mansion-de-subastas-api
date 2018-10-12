const EventEmitter = require('events');
const { Art, connection } = require('../data/db');

class ArtService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_ARTS: 'GET_ALL_ARTS',
            GET_ART_BY_ID: 'GET_ART_BY_ID',
            CREATE_ART: 'CREATE_ART',
            GET_ALL_ARTS_ERROR: 'GET_ALL_ARTS_ERROR',
            GET_ART_BY_ID_ERROR: 'GET_ART_BY_ID_ERROR',
            CREATE_ART_ERROR: 'CREATE_ART_ERROR'
        };
    }

    getAllArts() {
        Art.find({}, (err, arts) => {
            if(err) { this.emit(this.events.GET_ALL_ARTS_ERROR, err); }
            else { this.emit(this.events.GET_ALL_ARTS, arts); }
        });
    };

    getArtById(id) {
        Art.findById(id, (err, art) => {
            if(err) { this.emit(this.events.GET_ART_BY_ID_ERROR, err); }
            else { this.emit(this.events.GET_ART_BY_ID, art); }
        });
    };

    createArt(body) {
        const art = new Art({
            title: body.title,
            artistId: body.artistId,
            images: body.images,
            description: body.description
        });

        Art.create(art, (err) => {
            if(err) { this.emit(this.events.CREATE_ART_ERROR, err); }
            else { this.emit(this.events.CREATE_ART); }
        });
    };
};

module.exports = ArtService;
