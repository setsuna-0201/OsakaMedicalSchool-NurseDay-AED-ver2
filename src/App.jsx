import { useCallback, useEffect, useRef, useState } from 'react';

const SLIDES = Array.from({ length: 9 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return `${import.meta.env.BASE_URL}slides/slide-${number}.png`;
});

const AUTO_INTERVAL_MS = 10000;
const SWIPE_THRESHOLD_PX = 48;

const TEXT_PATCHES = {
  4: {
    tone: 'red',
    lines: [
      '呼吸をしていないと思ったら、',
      '直ちに胸の真ん中を',
      '強く・速く・絶え間なく圧迫します。',
    ],
  },
  6: {
    tone: 'red',
    lines: [
      'AEDが「離れてください」と音声案内をしたら、',
      '全員がその人の体から離れます。',
    ],
  },
  7: {
    tone: 'purple',
    lines: [
      '誰もその人の体に触れていないことを確認し、',
      'ショックボタンを押します。',
    ],
  },
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const touchStartX = useRef(null);
  const patch = TEXT_PATCHES[current];

  const goNext = useCallback(() => {
    setCurrent((value) => (value + 1) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((value) => (value - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!auto) return undefined;
    const timer = window.setInterval(goNext, AUTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [auto, goNext]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setAuto(false);
        goNext();
      }
      if (event.key === 'ArrowLeft') {
        setAuto(false);
        goPrev();
      }
      if (event.key === ' ') {
        event.preventDefault();
        setAuto((value) => !value);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  const handlePointer = () => {
    setAuto(false);
    goNext();
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      handlePointer();
      return;
    }

    setAuto(false);
    if (delta < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  return (
    <main
      className="viewer"
      aria-label="BLS and AED slide viewer"
      onClick={handlePointer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slide-stage">
        <img
          key={SLIDES[current]}
          className="slide-image"
          src={SLIDES[current]}
          alt={`BLS AED slide ${current + 1} of ${SLIDES.length}`}
          draggable="false"
        />
        {patch && (
          <div className={`text-patch patch-${current + 1} patch-${patch.tone}`}>
            {patch.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
