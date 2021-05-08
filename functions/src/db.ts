// import {auth, firestore} from "firebase-admin";
// import {EmptyUser, User, EncryptedUser, AccessTokenObject, UserWithAccessToken} from "./types";
// import {userExists} from "./users";

// const db = firestore();
// db.settings({ignoreUndefinedProperties: true});

// const {FieldValue} = firestore;

// export class UserExistsError extends Error {
//   constructor(uid: string) {
//     super(`User with UID ${uid} already exists.`);
//   }
// }

// export class UserDoesNotExistError extends Error {
//   constructor(uid: string) {
//     super(`User with UID ${uid} does not exist.`);
//   }
// }

// export const createUser = async (user: EmptyUser | User, avatarHash?: string): Promise<User | EmptyUser> => {
//   try {
//     const exists = await userExists(user.uid);

//     if (exists) {
//       throw new UserExistsError(user.uid);
//     }

//     const photoURL = avatarHash ? `https://cdn.discordapp.com/avatars/${user.uid}/${avatarHash}.png` : undefined;

//     const newAuthUser = await auth().createUser({
//       ...user,
//       photoURL,
//     });

//     await db.collection("users").doc(newAuthUser.uid).set(user);

//     return user;
//   } catch (e) {
//     console.error(e);
//     throw e;
//   }
// };

// export const getUser = async (uid: string): Promise<Partial<User>> => {
//   try {
//     const userDoc = await db.collection("users").doc(uid).get();

//     if (!userDoc.exists || !userDoc.data) {
//       throw new UserDoesNotExistError(uid);
//     }

//     const user = (userDoc.data() as unknown) as Partial<EncryptedUser>;

//     return user;
//   } catch (e) {
//     throw e;
//   }
// };

// export const getVerifiedUsers = async (): Promise<User[]> => {
//   try {
//     const documents = await db.collection("users").where("verified", "==", true).get();

//     const users: User[] = documents.docs
//         .map((doc) => doc.data() as User);

//     return users;
//   } catch (e) {
//     throw e;
//   }
// };

// export const updateUser = async (
//     uid: string,
//     partialUser: Partial<User>,
// ): Promise<Partial<User>> => {
//   try {
//     const userDoc = db.collection("users").doc(uid);

//     if (!(await userDoc.get()).exists) {
//       throw new UserDoesNotExistError(uid);
//     }

//     await userDoc.update(partialUser);

//     const updatedUser = ((await userDoc.get()).data() as unknown) as Partial<User>;

//     return updatedUser;
//   } catch (e) {
//     throw e;
//   }
// };

// export const clearUser = async (uid: string): Promise<Partial<User>> => {
//   try {
//     const userDoc = db.collection("users").doc(uid);

//     if (!(await userDoc.get()).exists) {
//       throw new UserDoesNotExistError(uid);
//     }

//     await userDoc.update({
//       ticketReference: FieldValue.delete(),
//       ticketSlug: FieldValue.delete(),
//       phoneNumber: FieldValue.delete(),
//       email: FieldValue.delete(),
//       firstName: FieldValue.delete(),
//       lastName: FieldValue.delete(),
//       fullName: FieldValue.delete(),
//       ticketReleaseId: FieldValue.delete(),
//       ticketReleaseTitle: FieldValue.delete(),
//       ticketUrl: FieldValue.delete(),
//     });

//     const updatedUser = ((await userDoc.get()).data() as unknown) as Partial<User>;

//     return updatedUser;
//   } catch (e) {
//     throw e;
//   }
// };

// export const storeAccessToken = async (uid: string, accessToken: AccessTokenObject): Promise<void> => {
//   try {
//     const userDoc = db.collection("users").doc(uid);

//     if (!(await userDoc.get()).exists) {
//       throw new UserDoesNotExistError(uid);
//     }

//     await userDoc.update({
//       accessToken: accessToken,
//     });

//     return;
//   } catch (e) {
//     throw e;
//   }
// };

// export const getAccessToken = async (uid: string): Promise<AccessTokenObject | false> => {
//   try {
//     const userDoc = db.collection("users").doc(uid);
//     const userDocData = await userDoc.get();

//     if (!userDocData.exists) {
//       throw new UserDoesNotExistError(uid);
//     }

//     const data = userDocData.data() as UserWithAccessToken;

//     if (!data.accessToken) {
//       return false;
//     }

//     return data.accessToken;
//   } catch (e) {
//     throw e;
//   }
// };
