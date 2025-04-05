export class NextAuthUserDto {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
}

export class NextAuthAccountDto {
  type: string;
  provider: string;
  providerAccountId: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}
