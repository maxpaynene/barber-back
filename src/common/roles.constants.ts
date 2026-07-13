export const ROLE = {
  ADMIN: 1,
  BARBER: 2,
  CLIENT: 3,
} as const;

export type RoleId = (typeof ROLE)[keyof typeof ROLE];