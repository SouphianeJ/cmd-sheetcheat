// lib/firestoreService.ts
import { promptsCollection, admin, PromptDocument } from './firebaseAdmin'; // Import depuis firebaseAdmin
import { Prompt } from '@/types/prompt'; // [source: prompt-shop.txt]
import { v4 as uuidv4 } from 'uuid';

const PROMPTS_COLLECTION_NAME = 'prompts'; // Défini ici pour être sûr

export async function getAllPromptsFromFirestore(): Promise<Prompt[]> {
  try {
    const snapshot = await promptsCollection.orderBy('title').get(); // Ou orderBy 'createdAt' si vous l'ajoutez
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Prompt, 'id'>), // Assurez-vous que les données correspondent
    }));
  } catch (error) {
    console.error('Error fetching all prompts from Firestore:', error);
    throw new Error('Failed to fetch prompts from Firestore.');
  }
}

export async function getPromptByIdFromFirestore(id: string): Promise<Prompt | null> {
  try {
    const docRef = promptsCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }
    return { id: docSnap.id, ...(docSnap.data() as Omit<Prompt, 'id'>) };
  } catch (error) {
    console.error(`Error fetching prompt by ID ${id} from Firestore:`, error);
    throw new Error('Failed to fetch prompt by ID from Firestore.');
  }
}

export async function addPromptToFirestore(promptData: Omit<Prompt, 'id'>): Promise<Prompt> {
  try {
    const id = uuidv4(); // Générer un nouvel ID
    const newPromptDocument: PromptDocument = {
      ...promptData,
      createdAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
      updatedAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
    };
    // Utiliser l'ID généré comme ID de document
    await promptsCollection.doc(id).set(newPromptDocument);
    return { id, ...promptData }; // Retourner le prompt complet avec l'ID généré
  } catch (error) {
    console.error('Error adding prompt to Firestore:', error);
    throw new Error('Failed to add prompt to Firestore.');
  }
}

export async function updatePromptInFirestore(id: string, updates: Partial<Omit<Prompt, 'id'>>): Promise<Prompt | null> {
  try {
    const docRef = promptsCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null; // Le prompt à mettre à jour n'existe pas
    }

    const updateData: Partial<PromptDocument> & { updatedAt: admin.firestore.Timestamp } = {
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
    };

    await docRef.update(updateData);
    
    // Récupérer le document mis à jour pour retourner les données complètes
    const updatedDocSnap = await docRef.get();
    if (!updatedDocSnap.exists) { // Double vérification, ne devrait pas arriver
        return null;
    }
    return { id: updatedDocSnap.id, ...(updatedDocSnap.data() as Omit<Prompt, 'id'>) };

  } catch (error) {
    console.error(`Error updating prompt ${id} in Firestore:`, error);
    throw new Error('Failed to update prompt in Firestore.');
  }
}

export async function deletePromptFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = promptsCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return false; // Le document n'existait pas, donc "suppression" réussie en ce sens
    }
    await docRef.delete();
    return true;
  } catch (error) {
    console.error(`Error deleting prompt ${id} from Firestore:`, error);
    throw new Error('Failed to delete prompt from Firestore.');
  }
}
