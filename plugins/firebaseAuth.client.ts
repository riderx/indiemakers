import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "~~/services/firebaseConfig";

export default defineNuxtPlugin((nuxtApp) => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // initUser();

    const auth = getAuth(app);

    nuxtApp.vueApp.provide('auth', auth);
    nuxtApp.provide('auth', auth);
});