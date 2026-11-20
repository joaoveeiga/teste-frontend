import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MainNav } from './MainNav';

const navigation = vi.hoisted(() => ({ pathname: '/notas' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}));

describe('MainNav', () => {
  it('links to every section', () => {
    render(<MainNav />);

    expect(screen.getByRole('link', { name: 'Notas' })).toHaveAttribute('href', '/notas');
    expect(screen.getByRole('link', { name: 'Faturamento' })).toHaveAttribute('href', '/faturamento');
  });

  it('marks the current section, including its sub-pages', () => {
    navigation.pathname = '/notas/nf-0001';
    render(<MainNav />);

    expect(screen.getByRole('link', { name: 'Notas' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Faturamento' })).not.toHaveAttribute('aria-current');
  });
});
