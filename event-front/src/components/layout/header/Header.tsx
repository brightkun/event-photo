"use client";

import { useLogout } from "@/components/hooks/auth/useAuth";
import { useMe } from "@/components/hooks/auth/useMe";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import HeaderWall from "./HeaderWall";
import "./header.scss";

const Header = () => {
  const pathname = usePathname();
  const { slug } = useParams<{ slug?: string }>();
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogout();

  const isWall = !!slug && pathname === `/events/${slug}`;
  const isPhoto = !!slug && pathname.startsWith(`/events/${slug}/photos/`);
  const isGuestJoin = pathname.startsWith("/join/");
  const isEventPage = (!!slug && (isWall || isPhoto)) || isGuestJoin;

  return (
    <header className={isWall || isPhoto ? "header hideMobile" : "header"}>
      <Link href="/" className="logo">
        <span className="dot" />
        <span className="name">Event Photo Mall</span>
      </Link>

      {slug && isWall && <HeaderWall slug={slug} />}

      {slug && isPhoto && (
        <Link href={`/events/${slug}`} className="backBtn">
          ← All photos
        </Link>
      )}

      {!isEventPage && (
        <nav className="nav">
          {user ? (
            <>
              <Link href="/account">My events</Link>
              {user.role === "admin" && <Link href="/admin">Admin</Link>}
              <button
                className="logoutBtn"
                onClick={() => logout()}
                disabled={isPending}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/register" className="startBtn">
                Get started
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
