// Все тексты сайта на английском. ru.ts повторяет эту же структуру.
export const en = {
  common: {
    loading: "Loading...",
    somethingWrong: "Something went wrong, try again",
    eventNotFound: "Event is not found",
    photoNotFound: "Photo is not found",
    delete: "Delete",
    admin: "Admin",
    user: "User",
    events: ["event", "events", "events"],
  },

  header: {
    myEvents: "My events",
    admin: "Admin",
    logout: "Log out",
    login: "Log in",
    getStarted: "Get started",
    allPhotos: "← All photos",
    uploadPhoto: "Upload photo",
    uploading: "Uploading...",
    uploadFailed: "Upload failed",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    language: "Language",
    menu: "Menu",
  },

  auth: {
    registerTitle: "Create account",
    loginTitle: "Welcome back",
    registerSubtitle: "Organizers need an account to create events. Guests never do.",
    loginSubtitle: "Log in to see your events.",
    name: "Name",
    namePlaceholder: "Anna",
    email: "Email",
    emailPlaceholder: "anna@example.com",
    password: "Password",
    passwordNewPlaceholder: "At least 8 characters",
    passwordPlaceholder: "Your password",
    submitRegister: "Create account",
    submitLogin: "Log in",
    wait: "Please wait...",
    haveAccount: "Already have an account? ",
    newHere: "New here? ",
    toLogin: "Log in",
    toRegister: "Create an account",
    nameRequired: "Enter your name",
    nameLong: "Name is too long",
    emailInvalid: "Enter a valid email",
    passwordShort: "At least 8 characters",
    passwordLong: "Too long",
    emailTaken: "This email is already registered",
    wrongCredentials: "Invalid email or password",
  },

  create: {
    title: "Create your event",
    subtitle: "Get a QR code. Guests scan it and share photos in one live feed.",
    name: "Event name",
    namePlaceholder: "Anna & Timur Wedding",
    date: "Date",
    location: "Location",
    locationPlaceholder: "Bishkek",
    nameRequired: "Enter event name",
    dateRequired: "Choose a date",
    locationRequired: "Enter location",
    submit: "Generate QR",
    submitting: "Generating...",
    previewBadge: "Live preview",
    previewName: "Your event name",
    previewInfo: "Date · Location",
  },

  ready: {
    badge: "Event ready",
    hint: "Guests scan this code to join. No app, no account.",
    localWarning:
      "This page is open on localhost, so phones can't open this QR. Open the site by your public link and create the event again.",
    downloadQr: "Download QR",
    copyLink: "Copy link",
    copied: "Copied!",
    copyFailed: "Copy failed",
    openWall: "Open wall",
  },

  join: {
    invited: "You are invited to",
    yourName: "Your name",
    namePlaceholder: "Enter your name",
    nameRequired: "Enter your name",
    nameLong: "Name is too long",
    submit: "Continue",
    submitting: "Joining...",
    note: "No account needed",
  },

  feed: {
    live: "Live",
    addPhoto: "Add photo",
    uploading: "Uploading…",
    failed: "Failed",
    emptyTitle: "Be the first to add a photo",
    emptyText: "Photos you upload show up here for everyone, live.",
    photoBy: (name: string) => `Photo by ${name}`,
  },

  photo: {
    back: "Back to wall",
    deleteConfirm: "Delete this photo?",
    comments: "Comments",
    commentPlaceholder: "Add a comment...",
    send: "Send comment",
    carousel: "Photos",
    prev: "Previous photo",
    next: "Next photo",
  },

  account: {
    title: "My events",
    newEvent: "New event",
    loadError: "Could not load your events",
    empty: "You have no events yet. Create one and get a QR code for your guests.",
    createFirst: "Create your first event",
    openWall: "Open wall",
    qrCode: "QR code",
    deleteConfirm: (name: string) => `Delete "${name}" with all its photos?`,
  },

  admin: {
    title: "Admin",
    users: "Users",
    events: "Events",
    photos: "Photos",
    comments: "Comments",
    noOwner: "No owner (old event)",
    noEvents: "No events yet",
  },

  landing: {
    eyebrow: "Live photo walls for events",
    titleStart: "Every guest's photos, ",
    titleAccent: "on one wall.",
    lead: "Create an event, show a QR code and watch photos, reactions and comments arrive while the party is happening. No app to install and no accounts for guests.",
    create: "Create an event",
    how: "See how it works",
    forWho:
      "For weddings, birthdays, conferences, school parties and every gathering worth remembering.",
    mockTitle: "Maya & Tom",
    toastName: "Anna",
    toastText: "added a photo",
    scan: "Scan to join",

    occasionsTitle: "Made for the moments you want to keep",
    occasionsIntro:
      "Whenever a lot of people take a lot of photos, the best ones end up scattered across phones. Event Photo Mall gathers them in one place, while the moment is still warm.",
    occasions: [
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
    ],

    howTitle: "How it works",
    howIntro: "Three simple steps, and nobody has to learn anything.",
    steps: [
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
    ],

    guestsTitle: "For guests",
    guestsLead: "Easy enough for the whole family.",
    guests: [
      "Scan the code, type a name, and you are in",
      "Add photos from the camera or the gallery",
      "React with ♥ 😂 🔥 or leave a short comment",
      "Swipe through every photo of the event",
      "Delete your own photo any time",
    ],
    organizersTitle: "For organizers",
    organizersLead: "Everything stays in your hands.",
    organizers: [
      "One account keeps all your events together",
      "Download the QR code or copy the link",
      "See photo and guest counts at a glance",
      "Remove a photo or the whole event whenever you want",
      "Moderators can step in if something goes wrong",
    ],

    liveEyebrow: "Live",
    liveTitle: "See the party as it happens",
    liveIntro:
      "The wall updates by itself. A new photo, a reaction or a comment shows up on every phone and on the big screen, with no refreshing and no waiting for the album the next morning.",
    feed: [
      { who: "Anna", what: "added a photo", when: "just now" },
      { who: "Boris", what: "reacted 🔥 to a photo", when: "1 min ago" },
      { who: "Dana", what: "wrote “This one is perfect”", when: "3 min ago" },
      { who: "Egor", what: "joined the event", when: "5 min ago" },
    ],

    faqTitle: "Good to know",
    faq: [
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
    ],

    ctaTitle: "Your next event starts with a QR code.",
    ctaText: "It takes about a minute to set up. Your guests will do the rest.",
  },
};

export type Dict = typeof en;
