"use client";

import { useRequireUser } from "@/components/hooks/auth/useRequireUser";
import { useDeleteEvent } from "@/components/hooks/events/useDeleteEvent";
import { useGetMyEvents } from "@/components/hooks/events/useGetMyEvents";
import { formatDate } from "@/components/utils/formatDate";
import { formatStats } from "@/components/utils/formatStats";
import Link from "next/link";
import "./account.scss";

const Account = () => {
  const { user, isLoading } = useRequireUser();
  const { data: events, isError } = useGetMyEvents(!!user);
  const { mutate, isPending } = useDeleteEvent();

  const onDelete = (slug: string, name: string) => {
    if (!window.confirm(`Delete "${name}" with all its photos?`)) return;

    mutate(slug);
  };

  if (isLoading || !user) {
    return (
      <section id="account">
        <p className="state">Loading...</p>
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
              {user.role === "admin" && <span className="role">Admin</span>}
            </p>
            <h1 className="title">My events</h1>
          </div>
          <Link href="/create" className="newBtn">
            New event
          </Link>
        </div>

        {isError && <p className="state">Could not load your events</p>}

        {events && events.length === 0 && (
          <div className="empty">
            <p className="text">
              You have no events yet. Create one and get a QR code for your
              guests.
            </p>
            <Link href="/create" className="newBtn">
              Create your first event
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
                    {formatDate(event.date)} · {event.location}
                  </span>
                  <span className="stats">
                    {formatStats(event.photos_count, event.guests_count)}
                  </span>
                </div>

                <div className="actions">
                  <Link href={`/events/${event.slug}`}>Open wall</Link>
                  <Link href={`/events/${event.slug}/ready`}>QR code</Link>
                  <button
                    className="delete"
                    onClick={() => onDelete(event.slug, event.name)}
                    disabled={isPending}
                  >
                    Delete
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
