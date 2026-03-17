import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import Institute from "@/models/Institute";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Institute Login",
      credentials: {
        instituteId: { label: "Institute ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.instituteId || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        // This handles "admin" login explicitly for the prototype
        if (credentials.instituteId === "admin" && credentials.password === "admin123") {
          return { id: "admin", name: "System Administrator", role: "ADMIN" };
        }

        await dbConnect();

        const institute = await Institute.findOne({ instituteId: credentials.instituteId });

        if (!institute) {
          throw new Error("Institute not found");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, institute.password);

        if (!isPasswordMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: institute._id.toString(),
          name: institute.name,
          instituteId: institute.instituteId,
          role: "INSTITUTE"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.instituteId = user.instituteId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.instituteId = token.instituteId;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
