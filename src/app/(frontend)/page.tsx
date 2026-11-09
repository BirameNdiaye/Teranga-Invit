import type { Metadata } from 'next'
import InvitationBuilder from './components/InvitationBuilder'

export const metadata: Metadata = {
  title: 'Créer votre invitation | Teranga Invit',
  description: 'Créez une invitation de mariage élégante, partageable et pensée pour vos invités.',
}

export default function HomePage() {
  return <InvitationBuilder />
}
