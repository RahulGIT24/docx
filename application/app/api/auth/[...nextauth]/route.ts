import { prisma } from "@/app/prisma/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth(
  {
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
      signIn: "/auth"
    },
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
        }
        return token;
      },

      async session({ session, token }) {
        session.user = {
          // id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
        return session;
      },
      async signIn(data) {
        const { id, name, email, image } = data.user;
        if (name && email && image) {
          if(!await prisma.user.findUnique({
            where:{
              email
            }
          })){
            await prisma.user.create({ data: { name: name, email: email, image: image } })
          }
          return true;
        }
        return false;
      }
    }
  }
)

export { handler as GET, handler as POST }