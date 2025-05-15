'use client';
import CmdForm from '@/components/CmdForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';


export default function NewCmdPage() {
  const { user, loadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/auth');
    }
  }, [user, loadingAuth, router]);

  if (loadingAuth) {
    return <p>Chargement...</p>; // Or a loading spinner
  }

  if (!user) {
    // This will likely not be reached if the redirect happens,
    // but it's good practice for clarity or if redirect is delayed.
    return <p>Redirection vers la page de connexion...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create a New Cmd</h2>
      <CmdForm />
    </div>
  );
}