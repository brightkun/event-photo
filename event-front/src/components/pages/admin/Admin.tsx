"use client";

import {
  useAdminEvents,
  useAdminStats,
  useAdminUsers,
} from "@/components/hooks/admin/useAdmin";
import { useRequireUser } from "@/components/hooks/auth/useRequireUser";
import { useDeleteEvent } from "@/components/hooks/events/useDeleteEvent";
import { useT } from "@/components/i18n/useT";
import { formatDate } from "@/components/utils/formatDate";
import { formatStats } from "@/components/utils/formatStats";
import { plural } from "@/components/utils/plural";
import Link from "next/link";
import { useState } from "react";
import "./admin.scss";

type Tab = "events" | "users";

const Admin = () => {
  const { t, lang } = useT();
  const { user, isLoading } = useRequireUser(true);
  const [tab, setTab] = useState<Tab>("events");
  const { data: stats } = useAdminStats(!!user);
  const { data: events } = useAdminEvents(!!user);
  const { data: users } = useAdminUsers(!!user);
  const { mutate, isPending } = useDeleteEvent();

  const onDelete = (slug: string, name: string) => {
    if (!window.confirm(t.account.deleteConfirm(name))) return;

    mutate(slug);
  };

  if (isLoading || !user) {
    return (
      <section id="admin">
        <p className="state">{t.common.loading}</p>
      </section>
    );
  }

  const numbers = [
    { label: t.admin.users, value: stats?.users_count },
    { label: t.admin.events, value: stats?.events_count },
    { label: t.admin.photos, value: stats?.photos_count },
    { label: t.admin.comments, value: stats?.comments_count },
  ];

  return (
    <section id="admin">
      <div className="admin">
        <h1 className="title">{t.admin.title}</h1>

        <div className="numbers">
          {numbers.map((item) => (
            <div className="number" key={item.label}>
              <span className="value">{item.value ?? "–"}</span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="tabs">
          <button
            className={tab === "events" ? "tab active" : "tab"}
            onClick={() => setTab("events")}
          >
            {t.admin.events}
          </button>
          <button
            className={tab === "users" ? "tab active" : "tab"}
            onClick={() => setTab("users")}
          >
            {t.admin.users}
          </button>
        </div>

        {tab === "events" && (
          <ul className="rows">
            {events?.map((event) => (
              <li className="row" key={event.id}>
                <div className="main">
                  <Link href={`/events/${event.slug}`} className="name">
                    {event.name}
                  </Link>
                  <span className="sub">
                    {formatDate(event.date, lang)} · {event.location}
                  </span>
                </div>
                <span className="cell owner">
                  {event.owner_email ?? t.admin.noOwner}
                </span>
                <span className="cell">
                  {formatStats(event.photos_count, event.guests_count, lang)}
                </span>
                <button
                  className="delete"
                  onClick={() => onDelete(event.slug, event.name)}
                  disabled={isPending}
                >
                  {t.common.delete}
                </button>
              </li>
            ))}
            {events?.length === 0 && (
              <li className="none">{t.admin.noEvents}</li>
            )}
          </ul>
        )}

        {tab === "users" && (
          <ul className="rows">
            {users?.map((item) => (
              <li className="row users" key={item.id}>
                <div className="main">
                  <span className="name plain">{item.name}</span>
                  <span className="sub">{item.email}</span>
                </div>
                <span className="cell">
                  {item.role === "admin" ? (
                    <span className="role">{t.common.admin}</span>
                  ) : (
                    t.common.user
                  )}
                </span>
                <span className="cell">
                  {item.events_count}{" "}
                  {plural(item.events_count, t.common.events, lang)}
                </span>
                <span className="cell">{formatDate(item.created_at, lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Admin;
