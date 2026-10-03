"use client";

import {
  useAdminEvents,
  useAdminStats,
  useAdminUsers,
} from "@/components/hooks/admin/useAdmin";
import { useRequireUser } from "@/components/hooks/auth/useRequireUser";
import { useDeleteEvent } from "@/components/hooks/events/useDeleteEvent";
import { formatDate } from "@/components/utils/formatDate";
import Link from "next/link";
import { useState } from "react";
import "./admin.scss";

type Tab = "events" | "users";

const Admin = () => {
  const { user, isLoading } = useRequireUser(true);
  const [tab, setTab] = useState<Tab>("events");
  const { data: stats } = useAdminStats(!!user);
  const { data: events } = useAdminEvents(!!user);
  const { data: users } = useAdminUsers(!!user);
  const { mutate, isPending } = useDeleteEvent();

  const onDelete = (slug: string, name: string) => {
    if (!window.confirm(`Delete "${name}" with all its photos?`)) return;

    mutate(slug);
  };

  if (isLoading || !user) {
    return (
      <section id="admin">
        <p className="state">Loading...</p>
      </section>
    );
  }

  const numbers = [
    { label: "Users", value: stats?.users_count },
    { label: "Events", value: stats?.events_count },
    { label: "Photos", value: stats?.photos_count },
    { label: "Comments", value: stats?.comments_count },
  ];

  return (
    <section id="admin">
      <div className="admin">
        <h1 className="title">Admin</h1>

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
            Events
          </button>
          <button
            className={tab === "users" ? "tab active" : "tab"}
            onClick={() => setTab("users")}
          >
            Users
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
                    {formatDate(event.date)} · {event.location}
                  </span>
                </div>
                <span className="cell owner">
                  {event.owner_email ?? "No owner (old event)"}
                </span>
                <span className="cell">
                  {event.photos_count} photos · {event.guests_count} guests
                </span>
                <button
                  className="delete"
                  onClick={() => onDelete(event.slug, event.name)}
                  disabled={isPending}
                >
                  Delete
                </button>
              </li>
            ))}
            {events?.length === 0 && <li className="none">No events yet</li>}
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
                    <span className="role">Admin</span>
                  ) : (
                    "User"
                  )}
                </span>
                <span className="cell">
                  {item.events_count}{" "}
                  {item.events_count === 1 ? "event" : "events"}
                </span>
                <span className="cell">{formatDate(item.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Admin;
