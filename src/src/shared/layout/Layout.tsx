import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

interface LayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
  showSidebar?: boolean
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      {showNavbar && <Navbar />}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">{children}</div>

        <Footer />
      </main>
    </div>
  )
}