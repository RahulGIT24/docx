import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/prisma/db";

export const options: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
        }),
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = Number(user.id);
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
            };
            return session;
        },
        async signIn(data) {
            const { id, name, email, image } = data.user;
            if (name && email && image) {
                if (!await prisma.user.findUnique({
                    where: {
                        email
                    }
                })) {
                    await prisma.user.create({ data: { name: name, email: email, image: image } })
                }
                return true;
            }
            return false;
        }
    }
}