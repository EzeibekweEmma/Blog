export interface TokenPayload {
  userId: string
  keyFunc?: string
}

export const keyFunc = {
  AUTH: 'Authentication',
  RESET_PASSWORD: 'Reset Password',
}