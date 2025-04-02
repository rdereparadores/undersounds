// src/constants.ts

/**
 * Roles de usuario de la aplicación
 */
export enum UserRole {
    USER = 'user',
    ARTIST = 'artist',
    ADMIN = 'admin'
}

/**
 * Estados posibles de una compra/pedido
 */
export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

/**
 * Formatos de productos musicales disponibles
 */
export enum ProductFormat {
    DIGITAL = 'digital',
    CD = 'cd',
    VINYL = 'vinyl',
    CASSETTE = 'cassette'
}

/**
 * Tipos de productos musicales
 */
export enum ProductType {
    SONG = 'song',
    ALBUM = 'album'
}