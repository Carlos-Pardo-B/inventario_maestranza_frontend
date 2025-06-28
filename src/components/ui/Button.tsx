// components/ui/Button.tsx
import React from 'react';

type ButtonProps = {
  text?: string;
  onClick: () => void;
  color?: 'blue' | 'red' | 'green' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Button = ({
  text,
  onClick,
  color = 'blue',
  size = 'md',
  disabled = false,
  className = '',
  children,
}: ButtonProps) => {
  // Estilos base
  const baseStyles = 'border rounded-md font-medium transition-all';

  // Mapeo de colores
  const colorStyles = {
    blue: 'border-blue-500 text-blue-500 hover:bg-blue-50',
    red: 'border-red-500 text-red-500 hover:bg-red-50',
    green: 'border-green-500 text-green-500 hover:bg-green-50',
    gray: 'border-gray-500 text-gray-500 hover:bg-gray-50',
  };

  // Mapeo de tamaños
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${colorStyles[color]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children || text}
    </button>
  );
};

export default Button;