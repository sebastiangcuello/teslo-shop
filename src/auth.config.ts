

import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';

const authenticatedRoutes = [
  "/checkout",
  "/profile",
  "/orders",
  "/admin",
];

const authenticatedAdminRoutes = [
  "/admin",
];

const isOnAuthenticatedRoutes = (onRoute: string, authenticatedRoutes: string[]) => {
  return authenticatedRoutes.some((authRoutes) =>
    onRoute.startsWith(authRoutes)
  );
};

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },
  callbacks:{  
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;

        if (auth?.user.role == 'user' && isOnAuthenticatedRoutes(nextUrl.pathname, authenticatedRoutes)) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        }
        if (auth?.user.role == 'admin' && isOnAuthenticatedRoutes(nextUrl.pathname, authenticatedAdminRoutes)) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        }
        return true;
      },

    jwt({ token, user }){

      if( user ){
        token.data = user;
      }

      return token;
    },
    session({ session, token }){

      session.user = token.data as any;

      return session;
    }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        //Buscar el correo
        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (!user) return null;

        // Comparar las contraseñas
        const passwordsMatch = bcryptjs.compareSync(password, user.password);

        if (!passwordsMatch) return null;

        // Regresar el usuario sin el password
        const { password: _, ...restUser } = user;

        return restUser;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);