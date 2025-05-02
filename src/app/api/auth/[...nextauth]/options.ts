import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { executeQuery } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account && account.provider === 'github') {
        token.githubId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          const githubId = token.githubId as string;
          
          const userResult = await executeQuery(
            'SELECT * FROM users WHERE github_id = $1',
            [githubId]
          );
          
          let user = userResult.rows[0];
          
          if (!user && session.user.email) {
            const newUserResult = await executeQuery(
              'INSERT INTO users (name, email, image, github_id) VALUES ($1, $2, $3, $4) RETURNING *',
              [session.user.name, session.user.email, session.user.image, githubId]
            );
            
            user = newUserResult.rows[0];
          } 

          else if (user) {
            await executeQuery(
              'UPDATE users SET name = $1, email = $2, image = $3 WHERE id = $4',
              [session.user.name, session.user.email, session.user.image, user.id]
            );
          }
          
          if (user) {
            session.user.id = user.id.toString();
          }
        } catch (error) {
          console.error('Error managing user in database:', error);
        }
      }
      
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};