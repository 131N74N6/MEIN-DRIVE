import 'express';

declare global {
    namespace Express {
        interface Request {
        user?: {
                user_id: string;
                token: string;
            }
        }
    }
}

export {};