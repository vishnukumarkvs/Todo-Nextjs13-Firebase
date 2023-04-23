import { app } from "./firebase.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const getCurrentUser = async () => {
  const promisifiedOnAuthStateChanged = (auth) => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  };

  const uid = await promisifiedOnAuthStateChanged(auth);
  return uid;
};

export const signUpUserWithEmailAndPassword = async (
  email,
  password,
  username
) => {
  // if (!username || !email || !password) {
  //     return;
  // }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: username,
    });
    console.log(userCredential.user);
    console.log(auth);
  } catch (error) {
    console.log(error);
  }
};

export const signInUserWithEmailAndPassword = async (email, password) => {
  try {
    console.log("hi");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log(userCredential.user);
  } catch (error) {
    console.log(error);
  }
};

export const signInWithGoogle = async () => {
  const user = await signInWithPopup(auth, provider);
  // console.log(user);
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};
