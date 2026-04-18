'use client';

import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Button } from 'flowbite-react';

export function NavBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-brand-border bg-white">
      <Navbar fluid>
        <NavbarBrand href="/">
          <img src="/full-logo.svg" alt="Sype" className="h-8" />
        </NavbarBrand>
        <div className="flex items-center gap-2 md:order-2">
          <Button color="light" pill>
            Log in
          </Button>
          <Button
            color="light"
            pill
            className="bg-brand-orange text-white hover:bg-brand-orangeHover border-0"
          >
            Sign up
          </Button>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            How it works
          </NavbarLink>
          <NavbarLink href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Schools
          </NavbarLink>
          <NavbarLink href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Pricing
          </NavbarLink>
          <NavbarLink href="#" className="text-sm text-gray-600 hover:text-brand-orange transition-colors">
            Help
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </div>
  );
}
