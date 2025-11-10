import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline";
}

export const Button = ({ variant = "default", className, ...props }: ButtonProps) => {
  const base = "px-4 py-2 rounded-lg font-semibold transition";
  const styles =
    variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
};
