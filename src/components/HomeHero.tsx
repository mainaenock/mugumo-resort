"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { imagePath, photos, resortMark } from "@/lib/resort";

const scenes = [
  { name: "The outdoor pool", photo: { ...photos.pool, file: "hero-poolside" }, focus: "50% 54%", mobileFocus: "57% 54%" },
  { name: "The garden grounds", photo: photos.grounds, focus: "50% 50%", mobileFocus: "44% 50%" },
  { name: "A deluxe room", photo: photos.double, focus: "50% 52%", mobileFocus: "50% 54%" },
  { name: "Poolside dining", photo: photos.diningTerrace, focus: "50% 58%", mobileFocus: "52% 54%" },
  { name: "The playground", photo: photos.playground, focus: "50% 65%", mobileFocus: "38% 63%" },
];

function adjacentScene(index: number, direction: number) {
  return (index + direction + scenes.length) % scenes.length;
}

export default function HomeHero() {
  const [{ current, previous, exitTransform }, setScene] = useState({ current: 0, previous: -1, exitTransform: "none" });
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const selection = useRef({ version: 0 });
  const playing = motionAllowed && !paused;
  const running = playing && visible;

  useEffect(() => {
    const pendingSelection = selection.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionAllowed(!motion.matches);
    const updateVisibility = () => setVisible(!document.hidden);

    updateMotion();
    updateVisibility();

    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      pendingSelection.version++;
    };
  }, []);

  async function showScene(index: number, manual = true) {
    if (manual) setPaused(true);

    const request = ++selection.current.version;
    const image = images.current[index];
    if (index === current || !image) return;

    try {
      await image.decode();
    } catch {
      // Keep the current photo visible if the requested image cannot load.
      return;
    }

    if (request !== selection.current.version) return;
    const outgoing = images.current[current]?.parentElement;
    setScene({ current: index, previous: current, exitTransform: outgoing ? getComputedStyle(outgoing).transform : "none" });
  }

  return (
    <section id="home" className="home-hero" aria-label="Resort photo tour" aria-roledescription="carousel" data-running={running}>
      <div className="home-hero-media" aria-hidden="true">
        {scenes.map((scene, index) => (
          <div
            key={scene.photo.file}
            className="home-hero-scene"
            data-state={index === current ? "current" : index === previous ? "outgoing" : "standby"}
            style={{
              "--scene-focus": scene.focus,
              "--scene-mobile-focus": scene.mobileFocus,
              "--scene-exit": index === previous ? exitTransform : "none",
            } as CSSProperties}
            onTransitionEnd={({ propertyName }) => {
              if (propertyName === "opacity" && index === current && previous !== -1) {
                setScene({ current, previous: -1, exitTransform: "none" });
              }
            }}
          >
            <div
              className="home-hero-frame"
              onAnimationEnd={({ animationName }) => {
                if (animationName === "resort-push-in" && index === current && running) {
                  void showScene(adjacentScene(current, 1), false);
                }
              }}
            >
              <Image
                ref={(image) => { images.current[index] = image; }}
                src={imagePath(scene.photo)}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? undefined : "eager"}
                fetchPriority={index === 0 ? undefined : "low"}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="wrap home-hero-content">
        <Image className="home-hero-logo" src={resortMark} alt="" width={512} height={512} priority />
        <h1>
          <span className="home-hero-title-prefix">The</span>{" "}
          <span className="home-hero-title-name">Mugumo Valley Resort</span>
        </h1>
        <div className="actions">
          <Link href="/book/" className="button button-gold">Book your stay</Link>
          <Link href="/rooms/" className="button button-outline-light">Explore rooms</Link>
        </div>
      </div>

      <div className="wrap home-hero-controls">
        <div className="photo-tour" role="group" aria-label="Photo tour controls">
          <div className="photo-tour-index">
            <p aria-live={playing ? "off" : "polite"}>{scenes[current].name}</p>
            <div className="photo-tour-dots" role="group" aria-label="Choose a photo">
              {scenes.map((scene, index) => (
                <button
                  key={scene.photo.file}
                  type="button"
                  aria-label={`Show ${scene.name.toLowerCase()}`}
                  aria-current={index === current ? "true" : undefined}
                  onClick={() => void showScene(index)}
                />
              ))}
            </div>
          </div>
          <div className="photo-tour-buttons">
            <button type="button" aria-label="Previous photo" onClick={() => void showScene(adjacentScene(current, -1))}>
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => void showScene(adjacentScene(current, 1))}>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
            {motionAllowed && (
              <button type="button" aria-label={playing ? "Pause photo tour" : "Play photo tour"} onClick={() => setPaused((wasPaused) => !wasPaused)}>
                {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
