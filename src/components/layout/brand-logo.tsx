import Image from "next/image";
import Link from "next/link";
import thulaLogo from "../../../public/Thula Logo.png";

type BrandLogoProps = {
  href?: string;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ href, className, priority = false }: BrandLogoProps) {
  const logo = (
    <Image
      src={thulaLogo}
      alt="Thula logo"
      className="brand-logo__image"
      priority={priority}
      sizes="(max-width: 640px) 160px, 220px"
    />
  );

  if (!href) {
    return <div className={["brand-logo", className].filter(Boolean).join(" ")}>{logo}</div>;
  }

  return (
    <Link href={href} className={["brand-logo", className].filter(Boolean).join(" ")}>
      {logo}
    </Link>
  );
}
