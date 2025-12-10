import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Force Node.js runtime (required for nodemailer/EmailProvider)
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
