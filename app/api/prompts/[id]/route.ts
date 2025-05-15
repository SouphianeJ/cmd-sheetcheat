// app/api/prompts/[id]/route.ts
import { NextResponse } from 'next/server';
import { 
    getPromptByIdFromFirestore, 
    updatePromptInFirestore, 
    deletePromptFromFirestore 
} from '@/lib/firestoreService'; // Import des services Firestore
import type { Prompt } from '@/types/prompt'; // [source: prompt-shop.txt]

interface Params {
  params: { id: string };
}

// GET: Récupérer un prompt par son ID
export async function GET(request: Request, { params }: Params) {
  const { id } = params;
  try {
    // require('@/lib/firebaseAdmin');
    const prompt = await getPromptByIdFromFirestore(id);
    if (!prompt) {
      return NextResponse.json({ message: 'Prompt not found' }, { status: 404 });
    }
    return NextResponse.json(prompt);
  } catch (error) {
    console.error(`API GET (prompt by ID ${id}) Error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

// PUT: Mettre à jour un prompt par son ID
export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  try {
    // require('@/lib/firebaseAdmin');
    const body = await request.json();
    const { id: bodyId, ...updateData } = body as Partial<Prompt>; // Exclure 'id' du corps si présent

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No update data provided.' }, { status: 400 });
    }
    if (updateData.tags && (!Array.isArray(updateData.tags) || !updateData.tags.every(tag => typeof tag === 'string'))) {
        return NextResponse.json({ message: 'Tags must be an array of strings.' }, { status: 400 });
    }
    if (updateData.tags) {
        updateData.tags = updateData.tags.map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
    }
    // S'assurer que title et content ne sont pas vides s'ils sont mis à jour
    if (updateData.title === '') {
        return NextResponse.json({ message: 'Title cannot be empty.' }, { status: 400 });
    }
    if (updateData.content === '') {
        return NextResponse.json({ message: 'Content cannot be empty.' }, { status: 400 });
    }


    const updatedPromptItem = await updatePromptInFirestore(id, updateData);
    if (!updatedPromptItem) {
      return NextResponse.json({ message: 'Prompt not found or failed to update' }, { status: 404 });
    }
    return NextResponse.json(updatedPromptItem);
  } catch (error) {
    console.error(`API PUT (update prompt ${id}) Error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

// DELETE: Supprimer un prompt par son ID
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;
  try {
    // require('@/lib/firebaseAdmin');
    const success = await deletePromptFromFirestore(id);
    if (!success) {
      // Cela peut signifier que le document n'existait pas initialement.
      // Pour une API DELETE, retourner 404 si la ressource à supprimer n'est pas trouvée est courant.
      return NextResponse.json({ message: 'Prompt not found' }, { status: 404 });
    }
    // Un statut 204 (No Content) est aussi commun pour un DELETE réussi, mais 200 avec message est ok.
    return NextResponse.json({ message: 'Prompt deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`API DELETE (prompt ${id}) Error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
