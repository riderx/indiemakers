/* eslint-disable camelcase */
import { firestore } from 'firebase-admin'

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

export type AccessTokenObject = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token: string
  scope: string
}

export type DiscordUser = {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  locale: string
  mfa_enabled: boolean
  premium_type: number
}

export class InvalidCodeError extends Error {}
export class NoAccessTokenError extends Error {}
export class ExpiredAccessTokenError extends Error {}

/**
 * User  discord interface
 *
 */
export interface User {
  uid: string
  twitter: string
  email: string
  firstName: string
  lastName: string
  karma: number
}

/**
 * User  discord interface
 *
 */
export interface Person {
  addedBy: string
  addDate: firestore.Timestamp
  updateDate: firestore.Timestamp
  toUpdate: boolean
  id_str: string
  name: string
  login: string
  description?: string
  bio: string
  pic: string
  votes: number
  number: number
}

export type EncryptedUser = User
export type EmptyUser = Pick<User, 'uid'>

export interface UserWithAccessToken extends User {
  accessToken: AccessTokenObject
}
