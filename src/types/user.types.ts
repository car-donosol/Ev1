/**
 * TypeScript types for Railway Users API
 * Based on the Kotlin models from the users microservice
 */

export interface User {
    id?: string;
    run: number;
    dv: number;
    pnombre: string;      // Primer nombre
    snombre?: string;     // Segundo nombre (opcional)
    appaterno: string;    // Apellido paterno
    apmaterno: string;    // Apellido materno
    email: string;
    telefono: number;
    fechareg?: string;    // Fecha de registro YYYY-MM-DD
    password?: string;    // No incluir en respuestas del cliente
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    user?: User;
}

export interface UserRequest {
    run: number;
    dv: number;
    pnombre: string;
    snombre?: string;
    appaterno: string;
    apmaterno: string;
    email: string;
    telefono: number;
    password: string;
}
