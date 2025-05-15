// lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import { Prompt } from '@/types/prompt'; // Assurez-vous que ce chemin est correct [source: prompt-shop.txt]

// Interface pour les données de prompt stockées dans Firestore (peut inclure des timestamps)
export interface PromptDocument extends Omit<Prompt, 'id'> {
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

// Vérifiez si l'application Firebase a déjà été initialisée
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('La variable d\'environnement FIREBASE_SERVICE_ACCOUNT_KEY n\'est pas définie.');
    }

    // Parse the service account key JSON string
    const parsedServiceAccount = JSON.parse(serviceAccountKey);

    admin.initializeApp({
      credential: admin.credential.cert(parsedServiceAccount),
      // Ajoutez l'URL de votre base de données si nécessaire, ex: databaseURL: "https://<VOTRE_PROJET_ID>.firebaseio.com"
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Vous pourriez vouloir gérer cette erreur plus spécifiquement,
    // par exemple, en empêchant l'application de démarrer ou en fournissant un mode dégradé.
  }
}

const firestore = admin.firestore();
const promptsCollection = firestore.collection('prompts');

export { firestore, promptsCollection, admin };
