"use client";

import { IPhoto } from "@/components/hooks/photos/useGetPhotos";
import { useT } from "@/components/i18n/useT";
import Link from "next/link";
import "./photoCard.scss";

interface IProps {
  slug: string;
  photo: IPhoto;
}

const PhotoCard = ({ slug, photo }: IProps) => {
  const { t } = useT();

  return (
    <Link
      href={`/events/${slug}/photos/${photo.id}`}
      className="photoCard"
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <img src={photo.url} alt={t.feed.photoBy(photo.guest_name)} />
      {photo.top_emoji && (
        <span className="reaction">
          <span className="emoji">{photo.top_emoji}</span>
          {photo.top_count}
        </span>
      )}
    </Link>
  );
};

export default PhotoCard;
