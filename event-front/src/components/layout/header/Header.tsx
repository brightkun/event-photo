"use client";

import { useLogout } from "@/components/hooks/auth/useAuth";
import { useMe } from "@/components/hooks/auth/useMe";
import { useT } from "@/components/i18n/useT";
import SettingsControls from "@/components/widgets/settingsControls/SettingsControls";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import HeaderWall from "./HeaderWall";
import "./header.scss";

const Header = () => {
  const { t } = useT();
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

      <div className="right">
        {slug && isWall && <HeaderWall slug={slug} />}

        {slug && isPhoto && (
          <Link href={`/events/${slug}`} className="backBtn">
            {t.header.allPhotos}
          </Link>
        )}

        {!isEventPage && (
          <nav className="nav">
            {user ? (
              <>
                <Link href="/account">{t.header.myEvents}</Link>
                {user.role === "admin" && (
                  <Link href="/admin">{t.header.admin}</Link>
                )}
                <button
                  className="logoutBtn"
                  onClick={() => logout()}
                  disabled={isPending}
                >
                  {t.header.logout}
                </button>
              </>
            ) : (
              <>
                <Link href="/login">{t.header.login}</Link>
                <Link href="/register" className="startBtn">
                  {t.header.getStarted}
                </Link>
              </>
            )}
          </nav>
        )}

        <SettingsControls />
      </div>
    </header>
  );
};

export default Header;
