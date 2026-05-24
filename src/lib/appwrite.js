import { Client, Account, Databases } from "appwrite";

// Appwrite設定
export const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// DB定数
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
export const COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_ID;