'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/notas', label: 'Notas' },
  { href: '/faturamento', label: 'Faturamento' },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="main-nav">
      <ul>
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? 'page' : undefined}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
