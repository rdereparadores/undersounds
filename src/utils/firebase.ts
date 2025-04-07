import * as serviceAccount from '../admin.json';
import admin from 'firebase-admin';

//Inicializa firebase
export const appFireBase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});