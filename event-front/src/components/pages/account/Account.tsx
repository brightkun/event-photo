"use client";

import { useRequireUser } from "@/components/hooks/auth/useRequireUser";
import { useDeleteEvent } from "@/components/hooks/events/useDeleteEvent";
import { useGetMyEvents } from "@/components/hooks/events/useGetMyEvents";
import { useT } from "@/components/i18n/useT";
import { formatDate } from "@/components/utils/formatDate";
import { formatStats } from "@/components/utils/formatStats";
import Link from "next/link";
import "./account.scss";

const Account = () => {
  const { t, lang } = useT();
  const { user, isLoading } = useRequireUser();
  const { data: events, isError } = useGetMyEvents(!!user);
  const { mutate, isPending } = useDeleteEvent();

  const onDelete = (slug: string, name: string) => {
    if (!window.confirm(t.account.deleteConfirm(name))) return;

    mutate(slug);
  };

  if (isLoading || !user) {
    return (
      <section id="account">
        <p className="state">{t.common.loading}</p>
      </section>
    );
  }

  return (
    <section id="account">
      <div className="account">
        <div className="top">
          <div className="heading">
            <p className="hello">
              {user.name}
              {user.role === "admin" && (
                <span className="role">{t.common.admin}</span>
              )}
            </p>
            <h1 className="title">{t.account.title}</h1>
          </div>
          <Link href="/create" className="newBtn">
            {t.account.newEvent}
          </Link>
        </div>

        {isError && <p className="state">{t.account.loadError}</p>}

        {events && events.length === 0 && (
          <div className="empty">
            <p className="text">{t.account.empty}</p>
            <Link href="/create" className="newBtn">
              {t.account.createFirst}
            </Link>
          </div>
        )}

        {events && events.length > 0 && (
          <ul className="list">
            {events.map((event) => (
              <li className="item" key={event.id}>
                <div className="info">
                  <Link href={`/events/${event.slug}`} className="name">
                    {event.name}
                  </Link>
                  <span className="details">
                    {formatDate(event.date, lang)} · {event.location}
                  </span>
                  <span className="stats">
                    {formatStats(event.photos_count, event.guests_count, lang)}
                  </span>
                </div>

                <div className="actions">
                  <Link href={`/events/${event.slug}`}>{t.account.openWall}</Link>
                  <Link href={`/events/${event.slug}/ready`}>
                    {t.account.qrCode}
                  </Link>
                  <button
                    className="delete"
                    onClick={() => onDelete(event.slug, event.name)}
                    disabled={isPending}
                  >
                    {t.common.delete}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Account;
