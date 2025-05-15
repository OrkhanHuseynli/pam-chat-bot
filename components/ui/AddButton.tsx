// import { cn } from '@/lib/utils';
import { cva, type VariantProps } from "class-variance-authority";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const buttonVariants = cva(
  "group ml-2 flex justify-center items-center border-1",
  {
    variants: {
      variant: {
        default: "border-blue-500 px-1 text-blue-500 hover:bg-blue-900",
        outline:
          "border-blue-500 px-1 text-blue-500 hover:bg-blue-500 hover:text-white",
        "outline-success": "border-success px-1 text-success",
        disabled: "border-gray-400 px-1 text-gray-400",
      },
      size: {
        default: "h-[32px] w-[80px]",
        sm: "h-[32px] min-w-[80px]",
        lg: "h-[38px] min-w-[80px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const AddButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, ...props }, _) => {
    return (
      <button
        type="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        <PlusIcon variant={variant} size={size} />
      </button>
    );
  }
);

const plusIconVariants = cva(
  "justify-center text-center rounded-full border-1",
  {
    variants: {
      variant: {
        default: "border-blue-500 text-blue-500",
        outline:
          "border-blue-500 text-blue-500 hover:bg-blue-500 group-hover:text-white group-hover:border-white",
        "outline-success": "border-success text-success",
        disabled: "border-gray-400 text-gray-400",
      },
      size: {
        default: "h-[16px] w-[16px] text-sm leading-4",
        sm: "h-[16px] w-[16px] text-sm leading-4",
        lg: "h-[20px] min-w-[20px] text-xl leading-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PlusIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof plusIconVariants> {}

const PlusIcon = React.forwardRef<HTMLDivElement, PlusIconProps>(
  ({ className, variant, size, ...props }, ref) => {
    if (variant === "outline-success") {
      return <Check />;
    }
    return (
      <span
        className={cn(plusIconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        +
      </span>
    );
  }
);

export { AddButton };
