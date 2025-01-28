import { Header } from './header'
import { Footer } from './footer'
import { ClientProviders } from '../providers/client-providers'

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ClientProviders>
  );
} 