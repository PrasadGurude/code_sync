import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        forceNew: true,   // Correct key name
        reconnectionAttempts: Infinity, // Fix typo
        timeout: 10000,
        transports: ['websocket']  // Fix typo
    };
    
    return io(import.meta.env.VITE_API_BACKEND_URL, options);
};
