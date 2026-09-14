import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-gold text-brand-black hover:bg-brand-gold-light shadow-[0_2px_20px_-4px_rgba(212,175,55,0.5)]",
  secondary: "bg-brand-black text-white hover:bg-brand-charcoal",
  outline:
    "border border-brand-black text-brand-black hover:bg-brand-black hover:text-white",
  ghost: "text-brand-black hover:bg-black/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children, fullWidth } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide uppercase text-xs md:text-sm transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, fullWidth: _fw, ...rest } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _fw;

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
