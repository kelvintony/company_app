import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/user';
import db from '../../../utils/db';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) {
        token._id = user._id;
        token.fullName = user.fullName;
      }
      if (user?.superUser) token.superUser = user.superUser;
      //   console.log('from jwt',token)
      return token;
    },
    async session({ session, token }) {
      if (token?._id) {
        session.user._id = token._id;
        session.user.fullName = token.fullName;
      }
      if (token?.superUser) session.user.superUser = token.superUser;
      //   console.log('from session',session)
      return JSON.stringify(session);
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (
          user &&
          bcryptjs.compareSync(credentials.password, user.password) &&
          user.verified === true
        ) {
          return {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            image: 'f',
            superUser: user.superUser,
          };

          //   console.log('checking the signin')
        } else if (
          user &&
          bcryptjs.compareSync(credentials.password, user.password) &&
          user.verified === false
        ) {
          throw new Error('Your email has not been verified');
        }

        throw new Error('Invalid email or password');
        // return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
