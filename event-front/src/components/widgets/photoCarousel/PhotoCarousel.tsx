"use client";

import { useT } from "@/components/i18n/useT";
import { useEffect, useLayoutEffect, useRef } from "react";
import "./photoCarousel.scss";

export interface ISlide {
  id: number;
  url: string;
  alt: string;
}

interface IProps {
  slides: ISlide[];
  currentId: number;
  onChange: (id: number) => void;
}

// Лента фото со свайпом: браузер сам «примагничивает» кадр (scroll-snap),
// а выбранное фото сообщаем наверх, когда прокрутка остановилась.
const PhotoCarousel = ({ slides, currentId, onChange }: IProps) => {
  const { t } = useT();
  const trackRef = useRef<HTMLDivElement>(null);
  const settledRef = useRef(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const index = Math.max(
    0,
    slides.findIndex((slide) => slide.id === currentId),
  );

  // Ставим ленту на нужное фото. Если индекс изменился из-за самого свайпа, ничего не делаем.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || settledRef.current === index) return;

    track.scrollTo({ left: index * track.clientWidth, behavior: "auto" });
  }, [index, slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const realign = () => {
      track.scrollTo({ left: index * track.clientWidth, behavior: "auto" });
    };

    window.addEventListener("resize", realign);
    return () => window.removeEventListener("resize", realign);
  }, [index]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const go = (step: number) => {
    const track = trackRef.current;
    if (!track) return;

    const from = Math.round(track.scrollLeft / track.clientWidth);
    const to = Math.min(slides.length - 1, Math.max(0, from + step));
    track.scrollTo({ left: to * track.clientWidth, behavior: "smooth" });
  };

  // Стрелки на клавиатуре, кроме момента, когда пишут комментарий
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea")) return;

      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onScroll = () => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;

      const next = Math.round(track.scrollLeft / track.clientWidth);
      const slide = slides[next];
      if (!slide || slide.id === currentId) return;

      settledRef.current = next;
      onChange(slide.id);
    }, 120);
  };

  return (
    <div className="photoCarousel">
      <div
        className="track"
        ref={trackRef}
        onScroll={onScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label={t.photo.carousel}
      >
        {slides.map((slide, i) => (
          <div className="slide" key={slide.id}>
            <img
              src={slide.url}
              alt={slide.alt}
              loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            className="arrow prev"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label={t.photo.prev}
          >
            ‹
          </button>
          <button
            className="arrow next"
            onClick={() => go(1)}
            disabled={index === slides.length - 1}
            aria-label={t.photo.next}
          >
            ›
          </button>
          <span className="counter">
            {index + 1} / {slides.length}
          </span>
        </>
      )}
    </div>
  );
};

export default PhotoCarousel;
