import NextAuth, { type NextAuthOptions } from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { player } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Hack to give session the id from players table
      if (session.user && token.user && (token.user as player).id) {
        session.user.id = (token.user as player).id as unknown as string;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "a name",
      credentials: { name: { label: "Name", type: "text" } },
      async authorize(credentials) {
        if (!credentials?.name) return null;
        const newPlayer = await prisma.player.create({
          data: {
            name: credentials.name,
          },
        });
        return newPlayer;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
