export interface AuthenticatedUser {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}
