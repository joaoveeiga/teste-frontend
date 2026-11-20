import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Painel de Notas Fiscais',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="topbar">
          <span className="topbar__title">Painel de Notas Fiscais</span>
          <MainNav />
        </header>
        <main className="content">{children}</main>
      </body>
    </html>
  );
}
