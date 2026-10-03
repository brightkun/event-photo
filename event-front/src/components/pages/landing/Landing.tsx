"use client";

import { useMe } from "@/components/hooks/auth/useMe";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import "./landing.scss";

const occasions = [
  {
    title: "Weddings",
    text: "Every table sees the party from a different angle. Now all those angles end up in one place.",
  },
  {
    title: "Birthdays",
    text: "Cake, candles and the chaos before it. Friends add the moments you were too busy to catch.",
  },
  {
    title: "Conferences",
    text: "Talks, coffee queues, hallway chats. A shared wall for the whole crowd, not just the official photographer.",
  },
  {
    title: "School parties",
    text: "Class trips and graduations, with photos from everyone instead of a chat full of lost files.",
  },
  {
    title: "Family gatherings",
    text: "Grandma does not need an app. She scans a code and sends her photos to everyone.",
  },
  {
    title: "Team events",
    text: "Offsites, launches and Friday dinners. Reactions and comments keep the memories fun.",
  },
];

const steps = [
  {
    title: "Create the event",
    text: "Give it a name, a date and a place. In a few seconds you get a QR code and a link.",
    note: "About one minute",
  },
  {
    title: "Show the code",
    text: "Put it on a table card, a screen or a wedding sign, or send the link in a chat. Guests scan it with the camera.",
    note: "No app to install",
  },
  {
    title: "Watch the wall fill up",
    text: "Photos, reactions and comments appear on every screen at once while the event is still going on.",
    note: "Live, no refreshing",
  },
];

const guestSide = [
  "Scan the code, type a name, and you are in",
  "Add photos from the camera or the gallery",
  "React with ♥ 😂 🔥 or leave a short comment",
  "Swipe through every photo of the event",
  "Delete your own photo any time",
];

const organizerSide = [
  "One account keeps all your events together",
  "Download the QR code or copy the link",
  "See photo and guest counts at a glance",
  "Remove a photo or the whole event whenever you want",
  "Moderators can step in if something goes wrong",
];

const feed = [
  { who: "Anna", what: "added a photo", when: "just now" },
  { who: "Boris", what: "reacted 🔥 to a photo", when: "1 min ago" },
  { who: "Dana", what: "wrote “This one is perfect”", when: "3 min ago" },
  { who: "Egor", what: "joined the event", when: "5 min ago" },
];

const faq = [
  {
    q: "Do guests need to install an app?",
    a: "No. Guests open the code with the phone camera and everything works in the browser.",
  },
  {
    q: "Do guests need an account?",
    a: "No. A guest types a name and starts adding photos. Only organizers have accounts.",
  },
  {
    q: "Who can see the photos?",
    a: "Anyone who has the event link or QR code can open the wall. The address is random and not listed anywhere, so share the code only with your guests.",
  },
  {
    q: "Which photo formats work?",
    a: "JPEG, PNG and WebP. Large photos are made smaller on the phone before they upload, so they arrive quickly.",
  },
  {
    q: "Can I delete a photo or an event?",
    a: "Yes. Guests can delete their own photos, and you can delete any event from your account together with all its photos.",
  },
  {
    q: "What if my guests have a poor connection?",
    a: "Photos are compressed before upload, which helps on slow networks. If an upload fails, the guest can simply try again.",
  },
];

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
  const { data: user } = useMe();
  const startHref = user ? "/create" : "/register";

  return (
    <section id="landing">
      <div className="hero">
        <div className="copy">
          <p className="eyebrow">Live photo walls for events</p>
          <h1 className="title">
            Every guest&apos;s photos, <em>on one wall.</em>
          </h1>
          <p className="lead">
            Create an event, show a QR code and watch photos, reactions and
            comments arrive while the party is happening. No app to install and
            no accounts for guests.
          </p>
          <div className="actions">
            <Link href={startHref} className="primary">
              Create an event
            </Link>
            <a href="#how" className="secondary">
              See how it works
            </a>
          </div>
          <p className="for">
            For weddings, birthdays, conferences, school parties and every
            gathering worth remembering.
          </p>
        </div>

        <div className="visual" aria-hidden="true">
          <div className="phone">
            <div className="screen">
              <div className="bar">
                <span className="wallTitle">Maya &amp; Tom</span>
                <span className="liveTag">
                  <span className="dot" />
                  Live
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
            <span className="avatar">A</span>
            <span>
              <b>Anna</b> added a photo
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
            <span className="caption">Scan to join</span>
          </div>
        </div>
      </div>

      <div className="occasions">
        <div className="inner">
          <h2 className="heading">Made for the moments you want to keep</h2>
          <p className="intro">
            Whenever a lot of people take a lot of photos, the best ones end up
            scattered across phones. Event Photo Mall gathers them in one place,
            while the moment is still warm.
          </p>
          <ul className="occasionList">
            {occasions.map((item) => (
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
          <h2 className="heading">How it works</h2>
          <p className="intro">Three simple steps, and nobody has to learn anything.</p>
          <ol className="steps">
            {steps.map((step, i) => (
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
            <h2 className="sideTitle">For guests</h2>
            <p className="sideLead">Easy enough for the whole family.</p>
            <ul className="checks">
              {guestSide.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="side">
            <h2 className="sideTitle">For organizers</h2>
            <p className="sideLead">Everything stays in your hands.</p>
            <ul className="checks">
              {organizerSide.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="live">
        <div className="inner">
          <div className="liveCopy">
            <p className="eyebrow">Live</p>
            <h2 className="heading">See the party as it happens</h2>
            <p className="intro">
              The wall updates by itself. A new photo, a reaction or a comment
              shows up on every phone and on the big screen, with no refreshing
              and no waiting for the album the next morning.
            </p>
          </div>
          <ul className="feed" aria-hidden="true">
            {feed.map((item) => (
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
          <h2 className="heading">Good to know</h2>
          <div className="questions">
            {faq.map((item) => (
              <details className="question" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <div className="cta">
        <h2 className="ctaTitle">Your next event starts with a QR code.</h2>
        <p className="ctaText">
          It takes about a minute to set up. Your guests will do the rest.
        </p>
        <Link href={startHref} className="primary">
          Create an event
        </Link>
      </div>

      <footer className="footer">
        <span className="brand">Event Photo Mall</span>
        <div className="links">
          {user ? (
            <Link href="/account">My events</Link>
          ) : (
            <Link href="/login">Log in</Link>
          )}
          <Link href={startHref}>Create an event</Link>
        </div>
      </footer>
    </section>
  );
};

export default Landing;
