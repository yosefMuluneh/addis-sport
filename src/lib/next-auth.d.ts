import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id to the user object
    } & DefaultSession["user"]; // Include default properties (name, email, image)
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Add id to the JWT token
  }
}