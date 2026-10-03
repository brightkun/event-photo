"use client";

import { useGetEvent } from "@/components/hooks/events/useGetEvent";
import { useGetPhotos } from "@/components/hooks/photos/useGetPhotos";
import { useRealtime } from "@/components/hooks/realtime/useRealtime";
import { formatStats } from "@/components/utils/formatStats";
import EmptyFeed from "@/components/widgets/emptyFeed/EmptyFeed";
import PhotoCard from "@/components/widgets/photoCard/PhotoCard";
import UploadPhoto from "@/components/widgets/uploadPhoto/UploadPhoto";
import "./photoFeed.scss";

interface IProps {
  slug: string;
}


const PhotoFeed = ({ slug }: IProps) => {
  useRealtime(slug);

  const { data: event, isLoading: isEventLoading, isError } = useGetEvent(slug);
  const { data: photos, isError: isPhotosError } = useGetPhotos(slug);

  if (isError || isPhotosError) {
    return (
      <section id="photoFeed">
        <p className="state">Event is not found</p>
      </section>
    );
  }

  if (isEventLoading || !event || !photos) {
    return (
      <section id="photoFeed">
        <p className="state">Loading...</p>
      </section>
    );
  }

  if (photos.length === 0) {
    return (
      <section id="photoFeed">
        <EmptyFeed slug={slug} />
      </section>
    );
  }

  return (
    <section id="photoFeed">
      <div className="photoFeed">
        <div className="top">
          <h1 className="title">{event.name}</h1>
          <p className="meta">
            <span className="live">
              <span className="dot" />
              Live
            </span>
            <span className="stats">
              {formatStats(event.photos_count, event.guests_count)}
            </span>
          </p>
        </div>

        <div className="grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} slug={slug} photo={photo} />
          ))}
        </div>
      </div>

      <UploadPhoto
        slug={slug}
        className="fab"
        busyLabel="Uploading…"
        failedLabel="Failed"
      >
        Add photo
      </UploadPhoto>
    </section>
  );
};

export default PhotoFeed;
