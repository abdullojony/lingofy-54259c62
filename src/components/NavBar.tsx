
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Flag, User } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="text-duolingo-green font-display font-bold text-3xl">
            lingofy
          </div>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/" className="flex flex-col items-center text-duolingo-dark hover:text-duolingo-green transition-colors">
            <Book className="h-6 w-6" />
            <span className="text-sm font-medium">Learn</span>
          </Link>
          
          <Link to="/practice" className="flex flex-col items-center text-duolingo-dark hover:text-duolingo-green transition-colors">
            <Flag className="h-6 w-6" />
            <span className="text-sm font-medium">Practice</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center text-duolingo-dark hover:text-duolingo-green transition-colors">
            <User className="h-6 w-6" />
            <span className="text-sm font-medium">Profile</span>
          </Link>

          <div className="ml-4">
            <div className="flex items-center gap-2">
              <div className="bg-duolingo-green text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                10
              </div>
              <div className="h-4 w-28 bg-duolingo-gray rounded-full overflow-hidden">
                <div className="h-full bg-duolingo-green w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
