import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/" },
    { label: "Parcel", href: "/parcels" },
    { label: "Create Shipment", href: "/create-shipment" },
    { label: "Shipment Quote", href: "/shipment-quote" },
    { label: "Project Tracker", href: "/projects" },
    { label: "Weekly Plan", href: "/weekly-plan" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-gray-800">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/logo.png" alt="Westsidez Logo" className="h-10 w-auto" />
              <span className="font-bold text-lg hidden sm:inline">Westsidez</span>
            </div>
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Notification Icon */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Hamburger Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-white">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  {menuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
