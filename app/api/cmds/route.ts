// app/api/cmds/route.ts
import { NextResponse } from 'next/server';
import { 
    getAllCmdsFromFirestore, 
    addCmdToFirestore 
} from '@/lib/firestoreService'; // Import des services Firestore
import type { Cmd } from '@/types/cmd'; // [source: cmd-shop.txt]

// GET: Récupérer tous les cmds
export async function GET() {
  try {
    // Initialisation de Firebase Admin (s'assure qu'il est prêt)
    // L'import de firebaseAdmin suffit généralement si l'initialisation y est bien gérée.
    // require('@/lib/firebaseAdmin'); 
    
    const cmds = await getAllCmdsFromFirestore();
    return NextResponse.json(cmds);
  } catch (error) {
    console.error('API GET (all cmds) Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error while fetching cmds';
    return NextResponse.json({ message }, { status: 500 });
  }
}

// POST: Créer un nouveau cmd
export async function POST(request: Request) {
  try {
    // require('@/lib/firebaseAdmin');
    const body = await request.json();
    // Valider le corps de la requête
    const { title, content, tags } = body as Omit<Cmd, 'id'>;

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields: title and content are required.' }, { status: 400 });
    }
    if (tags && (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string'))) {
        return NextResponse.json({ message: 'Tags must be an array of strings.' }, { status: 400 });
    }

    const newCmdData: Omit<Cmd, 'id'> = {
      title,
      content,
      tags: tags ? tags.map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : [],
    };

    const savedCmd = await addCmdToFirestore(newCmdData);
    return NextResponse.json(savedCmd, { status: 201 });
  } catch (error) {
    console.error('API POST (create cmd) Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
