import React from 'react';
import { Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            User Management Dashboard
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
