// lib/firestoreService.ts
import { cmdCollection, admin, CmdDocument } from './firebaseAdmin'; // Import depuis firebaseAdmin
import { Cmd } from '@/types/cmd'; // [source: cmd-shop.txt]
import { v4 as uuidv4 } from 'uuid';

const cmdS_COLLECTION_NAME = 'cmds'; // Défini ici pour être sûr

export async function getAllCmdsFromFirestore(): Promise<Cmd[]> {
  try {
    const snapshot = await cmdCollection.orderBy('title').get(); // Ou orderBy 'createdAt' si vous l'ajoutez
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Cmd, 'id'>), // Assurez-vous que les données correspondent
    }));
  } catch (error) {
    console.error('Error fetching all cmds from Firestore:', error);
    throw new Error('Failed to fetch cmds from Firestore.');
  }
}

export async function getCmdByIdFromFirestore(id: string): Promise<Cmd | null> {
  try {
    const docRef = cmdCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }
    return { id: docSnap.id, ...(docSnap.data() as Omit<Cmd, 'id'>) };
  } catch (error) {
    console.error(`Error fetching cmd by ID ${id} from Firestore:`, error);
    throw new Error('Failed to fetch cmd by ID from Firestore.');
  }
}

export async function addCmdToFirestore(cmdData: Omit<Cmd, 'id'>): Promise<Cmd> {
  try {
    const id = uuidv4(); // Générer un nouvel ID
    const newCmdDocument: CmdDocument = {
      ...cmdData,
      createdAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
      updatedAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
    };
    // Utiliser l'ID généré comme ID de document
    await cmdCollection.doc(id).set(newCmdDocument);
    return { id, ...cmdData }; // Retourner le cmd complet avec l'ID généré
  } catch (error) {
    console.error('Error adding cmd to Firestore:', error);
    throw new Error('Failed to add cmd to Firestore.');
  }
}

export async function updateCmdInFirestore(id: string, updates: Partial<Omit<Cmd, 'id'>>): Promise<Cmd | null> {
  try {
    const docRef = cmdCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null; // Le cmd à mettre à jour n'existe pas
    }

    const updateData: Partial<CmdDocument> & { updatedAt: admin.firestore.Timestamp } = {
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
    };

    await docRef.update(updateData);
    
    // Récupérer le document mis à jour pour retourner les données complètes
    const updatedDocSnap = await docRef.get();
    if (!updatedDocSnap.exists) { // Double vérification, ne devrait pas arriver
        return null;
    }
    return { id: updatedDocSnap.id, ...(updatedDocSnap.data() as Omit<Cmd, 'id'>) };

  } catch (error) {
    console.error(`Error updating cmd ${id} in Firestore:`, error);
    throw new Error('Failed to update cmd in Firestore.');
  }
}

export async function deleteCmdFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = cmdCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return false; // Le document n'existait pas, donc "suppression" réussie en ce sens
    }
    await docRef.delete();
    return true;
  } catch (error) {
    console.error(`Error deleting cmd ${id} from Firestore:`, error);
    throw new Error('Failed to delete cmd from Firestore.');
  }
}
