"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import HeaderWall from "./HeaderWall";
import "./header.scss";

const Header = () => {
  const pathname = usePathname();
  const { slug } = useParams<{ slug?: string }>();

  const isWall = !!slug && pathname === `/events/${slug}`;
  const isPhoto = !!slug && pathname.startsWith(`/events/${slug}/photos/`);

  return (
    <header className={isWall || isPhoto ? "header hideMobile" : "header"}>
      <Link href="/" className="logo">
        <span className="dot" />
        <span className="name">Event Photo Mall</span>
      </Link>

      {slug && isWall && <HeaderWall slug={slug} />}

      {slug && isPhoto && (
        <Link href={`/events/${slug}`} className="backBtn">
          ← Back to wall
        </Link>
      )}
    </header>
  );
};

export default Header;
