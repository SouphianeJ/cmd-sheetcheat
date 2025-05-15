'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@firebase/client';

export default function LogoutPage() {
  const { user, loadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Fonction de déconnexion
    const handleLogout = async () => {
      try {
        await signOut(auth); // Déconnexion Firebase
        // Redirection vers la page d'accueil ou une autre page après la déconnexion
        router.push('/');
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erreur de déconnexion:", error.message);
        } else {
          console.error("Erreur de déconnexion:", error);
        }
        // Gérer l'erreur ici (par exemple, afficher un message à l'utilisateur)
      }
    };

    // Déclencher la déconnexion au montage du composant
    handleLogout();
  }, [router]);

  // Afficher un message de chargement pendant la déconnexion
  return <p>Déconnexion en cours...</p>;
}