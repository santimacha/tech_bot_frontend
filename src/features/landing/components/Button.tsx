import type React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg";
  [key: string]: unknown;
}

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    outline:
      "border-2 border-purple-200 hover:border-purple-400 text-purple-600 hover:text-purple-700 bg-transparent hover:bg-purple-50",
  };

  const sizes = {
    default: "px-4 py-2 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
