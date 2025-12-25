import jwt from 'jsonwebtoken';


export function decodeToken(secret: string, token: string) {
    try {
        if (!secret) {
            throw new Error("Secret not found")
        }
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (err) {
        throw (err);
    }
}