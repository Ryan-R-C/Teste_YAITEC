import React from 'react';
import { ComponentProps } from 'react';

interface CardProps extends ComponentProps<'div'> {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function Card({ title, description, icon, onClick, className = '', ...props }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}