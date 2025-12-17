import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User {
        id: number,
        email: string,
        name: string
        // userToken:string
    }
    interface Session {
        user: {
            id: number,
            email: string,
            name: string
            // userToken:string
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: number,
        email: string,
        name: string
        // userToken:string
    }
}