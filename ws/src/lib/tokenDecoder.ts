import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
    userId: string;
    name: string;
}

export function decodeToken(secret: string, token: string) {
    try {
        if (!secret) {
            throw new Error("Secret not found")
        }
        const payload = jwt.verify(token, secret) as AuthPayload;
        return payload;
    } catch (err) {
        throw (err);
    }
}