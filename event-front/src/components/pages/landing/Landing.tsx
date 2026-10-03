"use client";

import { useMe } from "@/components/hooks/auth/useMe";
import { useT } from "@/components/i18n/useT";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import "./landing.scss";

const tiles = [
  [
    { tone: "terracotta", h: 118, chip: "♥ 8" },
    { tone: "sage", h: 86 },
    { tone: "sand", h: 104, chip: "🔥 5" },
  ],
  [
    { tone: "plum", h: 84 },
    { tone: "ochre", h: 126, chip: "😂 3" },
    { tone: "sky", h: 92 },
  ],
];

const Landing = () => {
  const { t } = useT();
  const l = t.landing;
  const { data: user } = useMe();
  const startHref = user ? "/create" : "/register";

  return (
    <section id="landing">
      <div className="hero">
        <div className="copy">
          <p className="eyebrow">{l.eyebrow}</p>
          <h1 className="title">
            {l.titleStart}
            <em>{l.titleAccent}</em>
          </h1>
          <p className="lead">{l.lead}</p>
          <div className="actions">
            <Link href={startHref} className="primary">
              {l.create}
            </Link>
            <a href="#how" className="secondary">
              {l.how}
            </a>
          </div>
          <p className="for">{l.forWho}</p>
        </div>

        <div className="visual" aria-hidden="true">
          <div className="phone">
            <div className="screen">
              <div className="bar">
                <span className="wallTitle">{l.mockTitle}</span>
                <span className="liveTag">
                  <span className="dot" />
                  {t.feed.live}
                </span>
              </div>
              <div className="tiles">
                {tiles.map((column, i) => (
                  <div className="column" key={i}>
                    {column.map((tile, j) => (
                      <div
                        className={`tile ${tile.tone}`}
                        style={{ height: tile.h }}
                        key={j}
                      >
                        {tile.chip && <span className="chip">{tile.chip}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="toast">
            <span className="avatar">{l.toastName[0]}</span>
            <span>
              <b>{l.toastName}</b> {l.toastText}
            </span>
          </div>

          <div className="qrCard">
            <QRCodeSVG
              value="https://event-photo-lime.vercel.app"
              size={110}
              level="M"
              marginSize={0}
              fgColor="#2a2420"
              bgColor="transparent"
            />
            <span className="caption">{l.scan}</span>
          </div>
        </div>
      </div>

      <div className="occasions">
        <div className="inner">
          <h2 className="heading">{l.occasionsTitle}</h2>
          <p className="intro">{l.occasionsIntro}</p>
          <ul className="occasionList">
            {l.occasions.map((item) => (
              <li className="occasion" key={item.title}>
                <h3 className="occasionTitle">{item.title}</h3>
                <p className="occasionText">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="how" id="how">
        <div className="inner">
          <h2 className="heading">{l.howTitle}</h2>
          <p className="intro">{l.howIntro}</p>
          <ol className="steps">
            {l.steps.map((step, i) => (
              <li className="step" key={step.title}>
                <span className="num">0{i + 1}</span>
                <h3 className="stepTitle">{step.title}</h3>
                <p className="stepText">{step.text}</p>
                <span className="stepNote">{step.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="sides">
        <div className="inner">
          <div className="side">
            <h2 className="sideTitle">{l.guestsTitle}</h2>
            <p className="sideLead">{l.guestsLead}</p>
            <ul className="checks">
              {l.guests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="side">
            <h2 className="sideTitle">{l.organizersTitle}</h2>
            <p className="sideLead">{l.organizersLead}</p>
            <ul className="checks">
              {l.organizers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="live">
        <div className="inner">
          <div className="liveCopy">
            <p className="eyebrow">{l.liveEyebrow}</p>
            <h2 className="heading">{l.liveTitle}</h2>
            <p className="intro">{l.liveIntro}</p>
          </div>
          <ul className="feed" aria-hidden="true">
            {l.feed.map((item) => (
              <li className="entry" key={item.who}>
                <span className="avatar">{item.who[0]}</span>
                <span className="text">
                  <b>{item.who}</b> {item.what}
                </span>
                <span className="when">{item.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="faq">
        <div className="inner">
          <h2 className="heading">{l.faqTitle}</h2>
          <div className="questions">
            {l.faq.map((item) => (
              <details className="question" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <div className="cta">
        <h2 className="ctaTitle">{l.ctaTitle}</h2>
        <p className="ctaText">{l.ctaText}</p>
        <Link href={startHref} className="primary">
          {l.create}
        </Link>
      </div>

      <footer className="footer">
        <span className="brand">Event Photo Mall</span>
        <div className="links">
          {user ? (
            <Link href="/account">{t.header.myEvents}</Link>
          ) : (
            <Link href="/login">{t.header.login}</Link>
          )}
          <Link href={startHref}>{l.create}</Link>
        </div>
      </footer>
    </section>
  );
};

export default Landing;
