import React from 'react';
import { render, screen } from '@testing-library/react';

import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('renders the Sype logo', () => {
    render(<NavBar />);
    expect(screen.getByAltText('Sype')).toBeInTheDocument();
  });

  it('renders Log in link', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login');
  });

  it('renders Sign up link', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup');
  });

  it('has sticky top-0 positioning on the header', () => {
    const { container } = render(<NavBar />);
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(header!.className).toContain('sticky');
    expect(header!.className).toContain('top-0');
  });

  it('uses a squircle floating nav darker than the page background', () => {
    const { container } = render(<NavBar />);
    const nav = container.querySelector('nav');
    expect(nav).not.toBeNull();
    expect(nav!.className).toMatch(/rounded-\[/);
    expect(nav!.className).toMatch(/bg-brand-ink\/\[/);
    expect(nav!.className).toContain('backdrop-blur-md');
  });

  it('aligns with landing content width and horizontal padding', () => {
    const { container } = render(<NavBar />);
    const shell = container.querySelector('header > div');
    expect(shell).not.toBeNull();
    expect(shell!.className).toContain('max-w-7xl');
    expect(shell!.className).toContain('px-6');
    expect(shell!.className).toContain('sm:px-8');
  });
});
