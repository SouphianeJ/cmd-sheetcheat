// app/api/prompts/route.ts
import { NextResponse } from 'next/server';
import { 
    getAllPromptsFromFirestore, 
    addPromptToFirestore 
} from '@/lib/firestoreService'; // Import des services Firestore
import type { Prompt } from '@/types/prompt'; // [source: prompt-shop.txt]

// GET: Récupérer tous les prompts
export async function GET() {
  try {
    // Initialisation de Firebase Admin (s'assure qu'il est prêt)
    // L'import de firebaseAdmin suffit généralement si l'initialisation y est bien gérée.
    // require('@/lib/firebaseAdmin'); 
    
    const prompts = await getAllPromptsFromFirestore();
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('API GET (all prompts) Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error while fetching prompts';
    return NextResponse.json({ message }, { status: 500 });
  }
}

// POST: Créer un nouveau prompt
export async function POST(request: Request) {
  try {
    // require('@/lib/firebaseAdmin');
    const body = await request.json();
    // Valider le corps de la requête
    const { title, content, tags } = body as Omit<Prompt, 'id'>;

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields: title and content are required.' }, { status: 400 });
    }
    if (tags && (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string'))) {
        return NextResponse.json({ message: 'Tags must be an array of strings.' }, { status: 400 });
    }

    const newPromptData: Omit<Prompt, 'id'> = {
      title,
      content,
      tags: tags ? tags.map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : [],
    };

    const savedPrompt = await addPromptToFirestore(newPromptData);
    return NextResponse.json(savedPrompt, { status: 201 });
  } catch (error) {
    console.error('API POST (create prompt) Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
