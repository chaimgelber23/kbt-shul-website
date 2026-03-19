import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App | null {
  if (adminApp) return adminApp;

  // Try service account key file first
  const keyPath = join(process.cwd(), "service-account-key.json");
  if (existsSync(keyPath)) {
    try {
      const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));
      adminApp =
        getApps().length === 0
          ? initializeApp({ credential: cert(serviceAccount) })
          : getApps()[0];
      return adminApp;
    } catch {
      // Fall through
    }
  }

  // Try GOOGLE_APPLICATION_CREDENTIALS env var (used in production/Vercel)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const credJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (credJson) {
        const serviceAccount = JSON.parse(credJson);
        adminApp =
          getApps().length === 0
            ? initializeApp({ credential: cert(serviceAccount) })
            : getApps()[0];
        return adminApp;
      }
    } catch {
      // Fall through
    }
  }

  return null;
}

export function getAdminFirestore(): Firestore | null {
  if (adminDb) return adminDb;
  const app = getAdminApp();
  if (!app) return null;
  adminDb = getFirestore(app);
  return adminDb;
}
