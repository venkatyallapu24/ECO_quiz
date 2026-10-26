import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-eco-emerald flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-eco-forest mb-2">404 — Off the Map</h1>
      <p className="text-sm text-gray-600 mb-8">
        The ecological trail you followed does not exist or has returned to nature.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-eco-forest text-white font-medium text-sm hover:bg-eco-forest-light transition-colors"
      >
        <Home className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
};
