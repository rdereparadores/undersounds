import moongose from 'mongoose';

const genreSchema = new moongose.Schema({
    genre: {
        type: String,
        required: true
    }
});