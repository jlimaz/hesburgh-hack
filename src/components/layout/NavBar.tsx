'use client';

import { Navbar, Button } from 'flowbite-react';

export function NavBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-brand-border bg-white">
      <Navbar fluid>
        <Navbar.Brand href="/">
          <img src="/full-logo.svg" alt="Sype" className="h-8" />
        </Navbar.Brand>
        <div className="flex items-center gap-2 md:order-2">
          <Button color="light" pill>
            Log in
          </Button>
          <Button
            pill
            className="bg-brand-orange text-white hover:bg-brand-orangeHover border-0"
          >
            Sign up
          </Button>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            How it works
          </Navbar.Link>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Schools
          </Navbar.Link>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Pricing
          </Navbar.Link>
          <Navbar.Link href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Help
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
