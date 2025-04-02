import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserAuth extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'artist' | 'admin';
    name?: string;
    surname?: string;
    artist_name?: string;
    birthdate?: Date;
    img_url?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserAuthSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'artist', 'admin'], default: 'user' },
    name: { type: String },
    surname: { type: String },
    artist_name: { type: String, sparse: true },
    birthdate: { type: Date },
    img_url: { type: String },
}, { timestamps: true });

// Método para comparar contraseñas
UserAuthSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save hook para hacer hash de la contraseña
UserAuthSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

export default mongoose.model<IUserAuth>('UserAuth', UserAuthSchema);