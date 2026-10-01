"use client";

import { useGetEvent } from "@/components/hooks/events/useGetEvent";
import { useOrigin } from "@/components/utils/config";
import { formatDate } from "@/components/utils/formatDate";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import "./eventReady.scss";

interface IProps {
  slug: string;
}

const EventReady = ({ slug }: IProps) => {
  const { push } = useRouter();
  const origin = useOrigin();
  const { data: event, isLoading, isError } = useGetEvent(slug);
  const qrRef = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const joinUrl = `${origin}/join/${slug}`;
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(
    origin,
  );

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${slug}-qr.png`;
    link.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  if (isLoading) {
    return (
      <section id="eventReady">
        <p className="state">Loading...</p>
      </section>
    );
  }

  if (isError || !event) {
    return (
      <section id="eventReady">
        <p className="state">Event is not found</p>
      </section>
    );
  }

  return (
    <section id="eventReady">
      <div className="eventReady">
        <div className="info">
          <span className="badge">Event ready</span>
          <h1 className="title">{event.name}</h1>
          <p className="details">
            {formatDate(event.date)} · {event.location}
          </p>
          <p className="hint">
            Guests scan this code to join. No app, no account.
          </p>
          {isLocal && (
            <p className="warning">
              This page is open on localhost, so phones can&apos;t open this
              QR. Open the site by your public link and create the event again.
            </p>
          )}

          <div className="actions">
            <button className="primaryBtn" onClick={downloadQr}>
              Download QR
            </button>
            <div className="secondary">
              <button className="secondaryBtn" onClick={copyLink}>
                {copyState === "copied" && "Copied!"}
                {copyState === "failed" && "Copy failed"}
                {copyState === "idle" && "Copy link"}
              </button>
              <button
                className="secondaryBtn"
                onClick={() => push(`/events/${slug}`)}
              >
                Open wall
              </button>
            </div>
          </div>
        </div>

        <div className="qrCard" ref={qrRef}>
          {origin && (
            <QRCodeCanvas
              value={joinUrl}
              size={315}
              level="M"
              marginSize={0}
              fgColor="#1c1a17"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default EventReady;
