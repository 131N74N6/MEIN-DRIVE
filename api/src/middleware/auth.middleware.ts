import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) return res.status(401).json({ message: 'Access token required' });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || 'jwt key') as any;
        
        // Find user and attach to request
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) return res.status(403).json({ message: 'Invalid or expired token' });
        return res.status(500).json({ message: 'Token verification failed' });
    }
}

async function checkOwnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const requestedUserId = req.params.id;
  
    if (req.user._id.toString() !== requestedUserId) return res.status(403).json({ message: 'Access denied' });
    
    next();
}

export { checkOwnership, verifyToken }