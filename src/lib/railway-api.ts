/**
 * Railway API Client
 * Handles communication with the Railway-deployed microservices
 */

import { LoginRequest, LoginResponse, User, UserRequest } from '@/types/user.types';

// Get API URLs from environment variables
const USERS_API_URL = process.env.NEXT_PUBLIC_USERS_API_URL || 'https://web-production-1f2fa.up.railway.app';

/**
 * Login user through Railway API
 * @param credentials - Email and password
 * @returns LoginResponse with success status and user data
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await fetch(`${USERS_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            // Handle HTTP errors
            if (response.status === 401) {
                return {
                    success: false,
                    message: 'Email o contraseña incorrectos',
                };
            }

            if (response.status === 404) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                };
            }

            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LoginResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Login API error:', error);
        return {
            success: false,
            message: 'Error de conexión. Por favor, intenta nuevamente.',
        };
    }
}

/**
 * Register new user through Railway API
 * @param userData - User registration data
 * @returns User object if successful
 */
export async function registerUser(userData: UserRequest): Promise<User | null> {
    try {
        const response = await fetch(`${USERS_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error('Register API error:', error);
        return null;
    }
}

/**
 * Get user by ID through Railway API
 * @param userId - User ID
 * @returns User object if found
 */
export async function getUserById(userId: string): Promise<User | null> {
    try {
        const response = await fetch(`${USERS_API_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error('Get user API error:', error);
        return null;
    }
}

/**
 * Get all users through Railway API
 * @returns Array of users
 */
export async function getAllUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${USERS_API_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users: User[] = await response.json();
        return users;
    } catch (error) {
        console.error('Get users API error:', error);
        return [];
    }
}
