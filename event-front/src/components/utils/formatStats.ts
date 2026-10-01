export const formatStats = (photos: number, guests: number) =>
  `${photos} ${photos === 1 ? "photo" : "photos"} · ${guests} ${guests === 1 ? "guest" : "guests"}`;
