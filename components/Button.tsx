import React, { HTMLAttributes } from "react";

export type ButtonProps = {
  disabled?: boolean;
  variant?:
    | "default"
    | "alternative"
    | "dark"
    | "light"
    | "green"
    | "red"
    | "yellow"
    | "purple";
  children?: React.ReactNode;
  loading?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const Button = ({
    loading,
  variant = "default",
  children,
  onClick,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "flex justify-center items-center gap-6 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-4 transition-colors duration-200";

  const variants = {
    default:
      "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    alternative:
      "text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
    dark: "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700",
    light:
      "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
    green:
      "text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
    red: "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    yellow:
      "text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300 dark:focus:ring-yellow-900",
    purple:
      "text-white bg-purple-700 hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900",
  };

  const variantClasses = variants[variant] || variants.default;
  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={ loading || disabled}
      {...props}
    >
        {
            loading ? 
            <span className="animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-refresh-ccw-icon lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
            </span>
            : null
        }
      {children}
    </button>
  );
};
