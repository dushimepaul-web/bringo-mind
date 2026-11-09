export type AuthUser = {
  id: string;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};
