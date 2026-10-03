"use client";

import { useGuest } from "@/components/hooks/guests/useGuest";
import { useDeletePhoto } from "@/components/hooks/photos/useDeletePhoto";
import { useGetPhoto } from "@/components/hooks/photos/useGetPhoto";
import { useGetPhotos } from "@/components/hooks/photos/useGetPhotos";
import { useRealtime } from "@/components/hooks/realtime/useRealtime";
import { useT } from "@/components/i18n/useT";
import { timeAgo } from "@/components/utils/timeAgo";
import Comments from "@/components/widgets/comments/Comments";
import PhotoCarousel, {
  ISlide,
} from "@/components/widgets/photoCarousel/PhotoCarousel";
import Reactions from "@/components/widgets/reactions/Reactions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./photoDetail.scss";

interface IProps {
  slug: string;
  photoId: string;
}


const PhotoDetail = ({ slug, photoId }: IProps) => {
  const { t, lang } = useT();
  useRealtime(slug);
  const { push } = useRouter();
  const { guest } = useGuest(slug);
  const [currentId, setCurrentId] = useState(Number(photoId));
  const { data: photos, isError: isPhotosError } = useGetPhotos(slug);
  const {
    data: photo,
    isLoading,
    isError,
  } = useGetPhoto(slug, String(currentId), guest?.token);
  const { mutate, isPending } = useDeletePhoto();

  const onDelete = () => {
    if (!photo?.is_owner || !window.confirm(t.photo.deleteConfirm)) return;

    mutate(
      { slug, photoId: String(currentId), token: guest?.token },
      { onSuccess: () => push(`/events/${slug}`) },
    );
  };

  // Свайп меняет только адрес в строке, без перезагрузки страницы
  const onChange = (id: number) => {
    setCurrentId(id);
    window.history.replaceState(null, "", `/events/${slug}/photos/${id}`);
  };

  if (isError || isPhotosError) {
    return (
      <section id="photoDetail">
        <p className="state">{t.common.photoNotFound}</p>
      </section>
    );
  }

  if (!photos || (isLoading && !photos.some((item) => item.id === currentId))) {
    return (
      <section id="photoDetail">
        <p className="state">{t.common.loading}</p>
      </section>
    );
  }

  const slides: ISlide[] = photos.map((item) => ({
    id: item.id,
    url: item.url,
    alt: t.feed.photoBy(item.guest_name),
  }));

  // Если фото нет в общем списке (например, только что удалили соседнее), показываем одно
  if (!slides.some((slide) => slide.id === currentId) && photo) {
    slides.push({
      id: photo.id,
      url: photo.url,
      alt: t.feed.photoBy(photo.guest_name),
    });
  }

  const author = photos.find((item) => item.id === currentId) ?? photo;

  return (
    <section id="photoDetail">
      <div className="mobileBar">
        <Link
          href={`/events/${slug}`}
          className="backLink"
          aria-label={t.photo.back}
        >
          ‹
        </Link>
        {photo?.is_owner && (
          <button
            className="mobileDelete"
            onClick={onDelete}
            disabled={isPending}
          >
            {t.common.delete}
          </button>
        )}
      </div>

      <PhotoCarousel
        slides={slides}
        currentId={currentId}
        onChange={onChange}
      />

      <aside className="side">
        {author && (
          <div className="author">
            <div className="avatar">{author.guest_name[0]?.toUpperCase()}</div>
            <div className="meta">
              <span className="name">{author.guest_name}</span>
              <span className="time">{timeAgo(author.created_at, lang)}</span>
            </div>
            {photo?.is_owner && (
              <button
                className="deleteBtn"
                onClick={onDelete}
                disabled={isPending}
              >
                {t.common.delete}
              </button>
            )}
          </div>
        )}

        <div className="reactionsSlot">
          {photo && (
            <Reactions
              slug={slug}
              photoId={String(currentId)}
              reactions={photo.reactions}
            />
          )}
        </div>
        <Comments key={currentId} slug={slug} photoId={String(currentId)} />
      </aside>
    </section>
  );
};

export default PhotoDetail;
