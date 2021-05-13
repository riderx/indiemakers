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

export const voteIfNotDone = (personId: string, uid: string) => {
  const voteRef = firestore().collection(`/people/${personId}/votes`).doc(uid);
  return voteRef.get()
      .then(async (docSnapshot): Promise<{ error: string } | { done: string }> => {
        if (docSnapshot.exists) {
          return {error: "Already voted"};
        }
        return voteRef.set({date: Date()})
            .then(() => ({done: "Voted"}))
            .catch(() => ({error: "Fail vote"}));
      }).catch((err: any) => {
        console.error("Fail vote", err);
        return {error: "Fail vote"};
      });
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
