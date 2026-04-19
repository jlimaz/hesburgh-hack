import React from 'react';
import { render, screen } from '@testing-library/react';

import { NavBarProfile } from './NavBarProfile';

describe('NavBarProfile', () => {
  it('renders the Sype logo', () => {
    render(<NavBarProfile />);
    expect(screen.getByAltText('Sype')).toBeInTheDocument();
  });

  it('does not render Log in or Sign up links', () => {
    render(<NavBarProfile />);
    expect(screen.queryByRole('link', { name: /log in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
  });

  it('renders profile link to account settings', () => {
    render(<NavBarProfile />);
    const profile = screen.getByRole('link', { name: /account settings/i });
    expect(profile).toHaveAttribute('href', '/dashboard/settings');
  });

  it('respects profileHref prop', () => {
    render(<NavBarProfile profileHref="/dashboard/wallet" />);
    expect(screen.getByRole('link', { name: /account settings/i })).toHaveAttribute(
      'href',
      '/dashboard/wallet',
    );
  });

  it('has sticky top-0 positioning on the header', () => {
    const { container } = render(<NavBarProfile />);
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(header!.className).toContain('sticky');
    expect(header!.className).toContain('top-0');
  });

  it('uses a squircle floating nav darker than the page background', () => {
    const { container } = render(<NavBarProfile />);
    const nav = container.querySelector('nav');
    expect(nav).not.toBeNull();
    expect(nav!.className).toMatch(/rounded-\[/);
    expect(nav!.className).toMatch(/bg-brand-ink\/\[/);
    expect(nav!.className).toContain('backdrop-blur-md');
  });

  it('aligns with landing content width and horizontal padding', () => {
    const { container } = render(<NavBarProfile />);
    const shell = container.querySelector('header > div');
    expect(shell).not.toBeNull();
    expect(shell!.className).toContain('max-w-7xl');
    expect(shell!.className).toContain('px-6');
    expect(shell!.className).toContain('sm:px-8');
  });
});
