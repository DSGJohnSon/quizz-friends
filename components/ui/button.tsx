import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "themeColor" | "white";
  size?: "sm" | "default" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "text-center px-6 py-1 pb-2 bg-linear-to-r from-[#462255] to-[#ef6351] rounded-xl inline-block",
      themeColor: "text-center px-6 py-1 pb-2 bg-[#ef6351] rounded-xl inline-block",
      white: "text-center px-6 py-1 pb-2 bg-white rounded-xl inline-block",
      outline: "border border-gray-300 bg-white hover:bg-gray-50",
      ghost: "hover:bg-gray-100",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
