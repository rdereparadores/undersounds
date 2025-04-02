import mongoose, { Document, Schema } from 'mongoose';
import { ISong } from './Song';
import { IAlbum } from './Album';
import { IUser } from './User';
import { IArtist } from './Artist';
import { IProvider } from './Provider';

export interface IPurchase extends Document {
    song?: mongoose.Types.ObjectId | ISong;
    album?: mongoose.Types.ObjectId | IAlbum;
    client: mongoose.Types.ObjectId | IUser;
    seller: mongoose.Types.ObjectId | IArtist;
    purchase_date: Date;
    price: number;
    status: 'pending' | 'completed' | 'cancelled';
    provider?: mongoose.Types.ObjectId | IProvider;
    createdAt: Date;
    updatedAt: Date;
}

const PurchaseSchema = new Schema({
    song: { type: Schema.Types.ObjectId, ref: 'Song' },
    album: { type: Schema.Types.ObjectId, ref: 'Album' },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    purchase_date: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' }
}, { timestamps: true });

// Validación para asegurarse de que se compra una canción o un álbum
PurchaseSchema.pre('validate', function(next) {
    if (!this.album && !this.song) {
        next(new Error('Debe proporcionar un álbum o una canción para comprar'));
    } else {
        next();
    }
});

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);