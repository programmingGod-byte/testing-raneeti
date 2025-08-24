// colorthief.d.ts
declare module 'colorthief';

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      isRegistered?: boolean
    }
  }

  interface User {
    id?: string
    isRegistered?: boolean
  }
}
