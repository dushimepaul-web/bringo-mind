// Point d'entrée « / » : choisit le bon premier écran.
// - démo : Tableau de bord (Claire est connectée) ;
// - API : première ouverture → présentation ; pas connecté → Bienvenue ; connecté → Tableau de bord
//   (le verrouillage Face ID s'affiche par-dessus si Claire l'a activé).
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { IS_DEMO } from '@/lib/config';
import { hasOnboarded } from '@/lib/launch';
import { useSession } from '@/lib/session';

export default function Index() {
  const { status } = useSession();
  const [onboarded, setOnboarded] = useState<boolean | null>(IS_DEMO ? true : null);

  useEffect(() => {
    if (IS_DEMO) return;
    let active = true;
    void hasOnboarded().then((value) => {
      if (active) setOnboarded(value);
    });
    return () => {
      active = false;
    };
  }, []);

  if (IS_DEMO) return <Redirect href="/dashboard" />;
  // Pendant ce court instant, l'animation d'ouverture couvre l'écran.
  if (status === 'loading' || onboarded === null) return null;
  if (status === 'unauthenticated') return <Redirect href={onboarded ? '/welcome' : '/onboarding'} />;
  return <Redirect href="/dashboard" />;
}
