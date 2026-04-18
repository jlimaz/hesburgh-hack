import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock flowbite-react to avoid JSDOM issues
jest.mock('flowbite-react', () => ({
  Navbar: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  NavbarBrand: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavbarToggle: () => <button aria-label="Toggle navigation" />,
  NavbarCollapse: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavbarLink: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
  Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
  ),
}));

import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('renders the Sype logo', () => {
    render(<NavBar />);
    expect(screen.getByAltText('Sype')).toBeInTheDocument();
  });

  it('renders all four nav links', () => {
    render(<NavBar />);
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Schools')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('renders Log in button', () => {
    render(<NavBar />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders Sign up button', () => {
    render(<NavBar />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('has sticky top-0 positioning on the outer wrapper', () => {
    const { container } = render(<NavBar />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('sticky');
    expect(wrapper.className).toContain('top-0');
  });
});
