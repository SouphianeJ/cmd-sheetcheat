'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '@firebase/client';
import { useRouter } from 'next/navigation'; // Importer useRouter

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); // Initialiser le router

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/'); // Rediriger après la connexion
        } catch (error) {
            console.error("Erreur connexion:", error.message);
            // Gérer l'erreur (ex: afficher un message d'erreur à l'utilisateur)
        }
    };

    
    return (
        <div>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Connexion</button>
            
        </div>
    );
}