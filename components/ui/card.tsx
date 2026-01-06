import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`${className}`} {...props} />;
  }
);
Card.displayName = "Card";

export { Card };
