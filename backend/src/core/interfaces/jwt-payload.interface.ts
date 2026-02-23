export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  organizationId?: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
