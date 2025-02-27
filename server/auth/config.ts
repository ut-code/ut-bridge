import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { panic } from "../lib/env.ts";

const app = initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID ?? panic("env FIREBASE_PROJECT_ID not found"),
});
export const auth = getAuth(app);
