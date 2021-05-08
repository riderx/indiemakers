import {auth, firestore} from "firebase-admin";

/**
 * Helper function for checking if a user exists
 *
 * @param {string} uid User ID
 * @return {boolean} if the user exists
 */
export const userExists = async (uid: string): Promise<boolean> => {
  try {
    const user = await auth().getUser(uid);
    if (user) {
      return true;
    }

    return false;
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      return false;
    } if (process.env.FUNCTIONS_EMULATOR) {
      return false;
    }
    return false;
  }
};

export const getPerson = async (id_str: string): Promise<FirebaseFirestore.DocumentReference | null> => {
  const person: FirebaseFirestore.DocumentReference | null = await firestore()
      .collection("people")
      .where("id_str", "==", id_str)
      .get()
      .then((snapshot) => {
        let result: FirebaseFirestore.DocumentReference | null = null;
        if (snapshot.empty) {
          console.error("No matching person", id_str);
          return null;
        }
        snapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          result = doc.ref;
        });
        return result;
      })
      .catch((err) => {
        console.error("Error getting person", err);
        return null;
      });
  console.log("Person", person);
  return person;
};

export const getPersonById = async (id: string): Promise<FirebaseFirestore.DocumentReference> => firestore()
    .collection("people")
    .doc(id);
