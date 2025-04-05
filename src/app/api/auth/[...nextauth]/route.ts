import NextAuth from "next-auth";
import { authOptions } from "./options";

/**
 * Alogrithm :)
 * make handler method
 * 
 */
const handler = NextAuth(authOptions)
export {handler as GET , handler as POST}