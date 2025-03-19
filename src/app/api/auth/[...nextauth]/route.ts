import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdmins } from "@/lib/admins";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const admins = getAdmins();
        console.log("Authorizing with credentials:", credentials);
        const user = admins.find(
          (u) => u.username === credentials?.username && u.password === credentials?.password
        );
        console.log("Found user:", user || "None");
        if (user) {
          return { id: user.id, name: user.username, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as "admin" | "user";
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };