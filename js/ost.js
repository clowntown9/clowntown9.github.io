(() => {
  const band = document.getElementById("soundtrack");
  if (!band) return;

  const $ = (s) => band.querySelector(s);
  const deck = $(".ost-deck"), tilt = $(".ost-tilt"), glow = $(".ost-glow");
  const cover = $(".ost-cover"), sheen = $(".ost-sheen"), audio = $(".ost-audio");
  const bar = $(".ost-bar i"), seek = $(".ost-bar input");
  const nowEl = $(".ost-now"), lenEl = $(".ost-len");
  const eq = band.querySelectorAll(".ost-eq b");
  const canvas = $(".ost-flies"), g = canvas.getContext("2d");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const total = () => (isFinite(audio.duration) && audio.duration > 0 ? audio.duration : +audio.dataset.length || 0);
  const mmss = (s) => { s = Math.floor(s || 0); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

  let analyser, bins, level = 0, peak = 0.12;

  function hookUp() {
    if (analyser || !window.AudioContext || !/^https?:$/.test(location.protocol)) return;
    try {
      const ctx = new AudioContext();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      bins = new Uint8Array(analyser.frequencyBinCount);
      ctx.createMediaElementSource(audio).connect(analyser).connect(ctx.destination);
      audio.ctx = ctx;
    } catch (e) {
      analyser = null;
    }
  }

  cover.addEventListener("click", () => {
    if (!audio.paused) return audio.pause();
    hookUp();
    if (audio.ctx && audio.ctx.state === "suspended") audio.ctx.resume();
    audio.play();
  });

  audio.addEventListener("play", () => {
    deck.classList.add("playing", "started");
    cover.setAttribute("aria-pressed", "true");
    cover.setAttribute("aria-label", "Pause the Sanctuary soundtrack");
  });
  audio.addEventListener("pause", () => {
    deck.classList.remove("playing");
    cover.setAttribute("aria-pressed", "false");
    cover.setAttribute("aria-label", "Play the Sanctuary soundtrack");
  });
  audio.addEventListener("ended", () => { audio.currentTime = 0; });
  audio.addEventListener("loadedmetadata", () => { lenEl.textContent = mmss(total()); });
  audio.addEventListener("timeupdate", () => {
    const f = total() ? Math.min(1, audio.currentTime / total()) : 0;
    bar.style.width = f * 100 + "%";
    seek.value = Math.round(f * 1000);
    nowEl.textContent = mmss(audio.currentTime);
  });
  seek.addEventListener("input", () => {
    if (total()) audio.currentTime = seek.value / 1000 * total();
  });

  const want = { x: 0, y: 0 }, have = { x: 0, y: 0 };
  let raise = 0, over = false;

  const aim = (e) => {
    const r = deck.getBoundingClientRect();
    want.x = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width * 0.55)));
    want.y = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height * 0.55)));
  };
  const setOver = (on) => {
    over = on;
    deck.classList.toggle("touching", on);
    if (!on) want.x = want.y = 0;
  };
  deck.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") { setOver(true); aim(e); } });
  deck.addEventListener("pointermove", (e) => { if (over) aim(e); });
  deck.addEventListener("pointerleave", () => setOver(false));

  const dpr = Math.min(devicePixelRatio || 1, 2);
  let flies = [];

  function resize() {
    canvas.width = band.clientWidth * dpr;
    canvas.height = band.clientHeight * dpr;
    const n = Math.round(band.clientWidth * band.clientHeight / 26000);
    flies = Array.from({ length: n }, () => ({
      x: Math.random(), y: 0.35 + Math.random() * 0.65,
      size: 0.6 + Math.random() * 1.6, phase: Math.random() * 6.28, speed: 0.4 + Math.random(),
    }));
  }
  resize();
  addEventListener("resize", resize);

  let onScreen = false;
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) requestAnimationFrame(frame);
  }).observe(band);

  const start = performance.now();

  function frame(now) {
    if (!onScreen) return;
    const t = (now - start) / 1000;

    if (analyser && !audio.paused) {
      analyser.getByteFrequencyData(bins);
      let sum = 0;
      for (let i = 2; i < 40; i++) sum += bins[i];
      const raw = sum / (38 * 255);
      peak = Math.max(peak * 0.997, raw, 0.08);
      level += (Math.min(1, raw / peak) - level) * 0.22;
      eq.forEach((b, i) => { b.style.transform = "scaleY(" + (0.2 + Math.min(1, bins[4 + i * 9] / 220)) + ")"; });
    } else {
      level *= 0.95;
      eq.forEach((b) => { b.style.transform = "scaleY(.25)"; });
    }

    raise += ((over ? 1 : 0) - raise) * 0.12;
    have.x += (want.x - have.x) * 0.1;
    have.y += (want.y - have.y) * 0.1;

    if (!calm) {
      const x = have.x * raise, y = have.y * raise;
      tilt.style.transform = `translate3d(${(x * 20).toFixed(2)}px, ${(y * 14).toFixed(2)}px, ${(raise * 34).toFixed(2)}px) rotateY(${(x * 14).toFixed(2)}deg) rotateX(${(-y * 11).toFixed(2)}deg)`;
      sheen.style.setProperty("--sx", (50 + have.x * 40).toFixed(1) + "%");
      sheen.style.setProperty("--sy", (40 + have.y * 40).toFixed(1) + "%");
      sheen.style.opacity = raise.toFixed(3);
      cover.style.boxShadow = `${(-x * 26).toFixed(1)}px ${(10 + 24 * raise - y * 14).toFixed(1)}px ${(26 + 36 * raise).toFixed(1)}px ${-14 - 4 * raise}px rgba(0,0,0,${(0.5 + 0.25 * raise).toFixed(2)}), 0 0 0 1px rgba(255,255,255,.08)`;
    }

    glow.style.setProperty("--pulse", (1 + level * 0.28).toFixed(3));
    glow.style.opacity = audio.paused ? "" : (0.55 + level * 0.45).toFixed(3);

    g.clearRect(0, 0, canvas.width, canvas.height);
    for (const f of flies) {
      const drift = calm ? 0 : (t * 0.006 * f.speed) % 1;
      const sway = calm ? 0 : Math.sin(t * 0.3 * f.speed + f.phase) * 0.02;
      const x = (f.x + sway) * canvas.width;
      const y = ((f.y - drift) % 1 + 1) % 1 * canvas.height;
      const a = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.7 * f.speed + f.phase));
      const r = f.size * dpr * 6;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(255,236,170,${Math.min(1, a).toFixed(3)})`);
      grad.addColorStop(1, "rgba(255,220,140,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, 6.283);
      g.fill();
    }
    requestAnimationFrame(frame);
  }
})();
