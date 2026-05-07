import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_INTERVAL_MS = 10000;
const SWIPE_THRESHOLD_PX = 48;

const slides = [
  {
    step: '01',
    theme: 'green',
    title: '安全と反応の確認',
    image: 'step01_scene.png',
    body: [
      '周囲の安全を確認してから近づきます。',
      '肩をたたきながら、大きな声で「大丈夫ですか？」と呼びかけます。',
    ],
    callout: '「大丈夫ですか！」',
  },
  {
    step: '02',
    theme: 'blue',
    title: '119番通報とAEDの手配',
    image: 'step02_scene.png',
    body: [
      '反応がなければ大声で助けを呼びます。',
      '「あなたは119番通報をお願いします」「あなたはAEDを持ってきてください」のように、具体的に指名して依頼します。',
    ],
    callout: ['「あなたは119番をお願いします！」', '「あなたはAEDを持ってきてください！」'],
  },
  {
    step: '03',
    theme: 'red',
    title: '胸骨圧迫を開始',
    image: 'step03_scene.png',
    body: [
      '普段どおりの呼吸がない、または判断に迷うときは胸骨圧迫を始めます。',
      '胸の真ん中を、強く・速く・絶え間なく圧迫します。',
    ],
    metrics: [
      ['深さ', '約5cm'],
      ['速さ', '100〜120回/分'],
      ['原則', '中断しない'],
    ],
  },
  {
    step: '04',
    theme: 'orange',
    title: 'AEDの到着と装着',
    image: 'step04_scene.png',
    body: [
      'AEDが届いたら電源を入れ、音声案内に従います。',
      'パッドは素肌に直接貼ります。貼る位置はイラスト表示を確認します。',
    ],
    steps: ['患者の横に置く', 'ふたを開けて電源を入れる', '貼る位置を確認する', '素肌に直接貼る'],
  },
  {
    step: '05',
    theme: 'red',
    title: '電気ショックの前は離れる',
    image: 'step05_scene.png',
    body: [
      'AEDが「離れてください」と案内したら、全員が患者から手を離します。',
      '感電を防ぐため、誰も体に触れていないことを確認します。',
    ],
    warning: '感電の危険。電気ショックのときは体に触れない。',
  },
  {
    step: '06',
    theme: 'purple',
    title: '解析と電気ショック',
    image: 'step06_scene.png',
    body: [
      '誰も患者に触れていないことを確認して、解析を待ちます。',
      'ショックが必要と案内されたらボタンを押します。',
    ],
    callout: 'ショック後は、すぐ胸骨圧迫を再開します。',
  },
  {
    step: '07',
    theme: 'green',
    title: 'みんなで協力して命をつなぐ',
    image: 'step07_scene.png',
    body: [
      '救急隊到着まで胸骨圧迫を続けます。',
      '疲れる前に周囲の人と交代し、役割を分担します。',
    ],
    callout: '「みんなで協力！」',
  },
  {
    step: '08',
    theme: 'orange',
    title: '命を救う最初の一歩',
    image: 'step08_scene.png',
    body: [
      'いざというとき、落ち着いて行動することが大切です。',
      'このサイトではBLSとAEDの基本の流れを、短時間で確認できます。',
    ],
    callout: 'みんなで守ろう みんなのいのち',
  },
  {
    step: '09',
    theme: 'blue',
    title: '大阪医療センター附属看護学校',
    image: 'step09_scene.png',
    body: ['3分で救命チャレンジ体験', 'タップまたはスワイプで、くり返し学べる構成にする'],
    callout: 'BLS & AED LIFE SAVING GUIDE',
  },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.5-4.8-9.6-9.3C.9 8.4 2.6 5 6.1 5c2 0 3.4 1 4.2 2.2C11 6 12.4 5 14.4 5c3.5 0 5.2 3.4 3.7 6.7C16 16.2 12 21 12 21Z" />
    </svg>
  );
}

function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'} />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h3v14H7Zm7 0h3v14h-3Z" />
    </svg>
  );
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const touchStartX = useRef(null);
  const slide = slides[current];

  const goNext = useCallback(() => {
    setCurrent((value) => (value + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((value) => (value - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!auto) return undefined;
    const timer = window.setInterval(goNext, AUTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [auto, goNext]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === ' ') {
        event.preventDefault();
        setAuto((value) => !value);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      goNext();
      return;
    }

    if (delta < 0) goNext();
    if (delta > 0) goPrev();
  };

  return (
    <main
      className={`app theme-${slide.theme}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <section className="deck" aria-label="BLS and AED learning slides">
        <header className="topbar">
          <div className="brand">
            <span className="brand-icon">
              <HeartIcon />
            </span>
            <span>
              <strong>BLS & AED</strong>
              <em>LIFE SAVING GUIDE</em>
            </span>
          </div>

          <div className="top-actions">
            <div className="counter">
              <b>{current + 1}</b>
              <span>/ {slides.length}</span>
            </div>
            <button className="auto-button" type="button" onClick={() => setAuto((value) => !value)}>
              <span className="auto-icon">{auto ? <PauseIcon /> : <PlayIcon />}</span>
              <span>{auto ? 'AUTO ON' : 'AUTO OFF'}</span>
            </button>
          </div>
        </header>

        <div className="slide-card" key={slide.step}>
          <button className="nav-button nav-left" type="button" onClick={goPrev} aria-label="前のスライド">
            <Chevron direction="left" />
          </button>
          <button className="nav-button nav-right" type="button" onClick={goNext} aria-label="次のスライド">
            <Chevron direction="right" />
          </button>

          <div className="medical-mark plus">+</div>
          <div className="medical-mark pulse" />

          <div className="copy">
            <div className="step-number">{slide.step}</div>
            <div className="step-pill">
              <span>✋</span>
              STEP {slide.step}
            </div>
            <h1>{slide.title}</h1>
            <div className="body-text">
              {slide.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="visual">
            <img src={`${import.meta.env.BASE_URL}assets/${slide.image}`} alt={slide.title} />
          </div>

          <div className="support">
            {slide.metrics && (
              <div className="metric-panel">
                {slide.metrics.map(([label, value]) => (
                  <div className="metric" key={label}>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            )}

            {slide.steps && (
              <ol className="step-list">
                {slide.steps.map((item, index) => (
                  <li key={item}>
                    <span>{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ol>
            )}

            {slide.warning && <div className="warning-box">{slide.warning}</div>}

            {slide.callout && (
              <div className="callout">
                {Array.isArray(slide.callout)
                  ? slide.callout.map((line) => <span key={line}>{line}</span>)
                  : slide.callout}
              </div>
            )}
          </div>
        </div>

        <footer className="footer-hint">
          <span />
          <b>タップ</b>
          <em>または</em>
          <b>スワイプ</b>
          <em>で次へ</em>
          <span />
        </footer>
      </section>
    </main>
  );
}
