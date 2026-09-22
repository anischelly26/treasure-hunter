// Adapted from the point field in the companion portfolio's data-field canvas.
// This canvas is limited to the hero and does not capture pointer events.
(() => {
  const hero = document.getElementById('home');
  const canvas = document.getElementById('heroBubbles');
  const context = canvas?.getContext('2d');
  if (!hero || !context) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const dots = [];
  const pointer = { x: -1000, y: -1000, active: false };
  let width = 0;
  let height = 0;
  let visible = false;
  let frame = 0;
  let lastTime = 0;

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots.length = 0;
    const count = reduced.matches || !finePointer.matches ? 22 : Math.min(75, Math.floor(width / 17));
    for (let i = 0; i < count; i++) {
      const x = ((i * 137.5 + 43) % 1000) / 1000 * width;
      const y = ((i * 83.7 + 137) % 1000) / 1000 * height;
      dots.push({ x, y, dx: 0, dy: 0, radius: 1 + (i % 4) * .45, phase: i * 1.73 });
    }
    render(performance.now());
  }

  function render(time) {
    context.clearRect(0, 0, width, height);
    const dt = Math.min((time - (lastTime || time)) / 16.67, 2);
    lastTime = time;
    const moving = !reduced.matches && finePointer.matches;
    for (const dot of dots) {
      const driftX = moving ? Math.sin(time * .0003 + dot.phase) * 9 : 0;
      const driftY = moving ? Math.cos(time * .00025 + dot.phase) * 10 : 0;
      const baseX = dot.x + driftX;
      const baseY = dot.y + driftY;
      const distance = pointer.active ? Math.hypot(pointer.x - baseX, pointer.y - baseY) : Infinity;
      const proximity = moving ? Math.max(0, 1 - distance / 155) : 0;
      const desiredX = proximity * (pointer.x - baseX) * .22;
      const desiredY = proximity * (pointer.y - baseY) * .22;
      // Ease both toward the pointer and back to rest, without a position jump.
      const ease = 1 - Math.exp(-.095 * dt);
      dot.dx += (desiredX - dot.dx) * ease;
      dot.dy += (desiredY - dot.dy) * ease;
      const x = baseX + dot.dx;
      const y = baseY + dot.dy;
      context.beginPath();
      context.fillStyle = `rgba(215,169,79,${.24 + proximity * .52})`;
      context.arc(x, y, dot.radius * (1 + proximity * .65), 0, Math.PI * 2);
      context.fill();
      if (proximity > .04) {
        context.beginPath();
        context.strokeStyle = `rgba(215,169,79,${proximity * .13})`;
        context.moveTo(x, y);
        context.lineTo(pointer.x, pointer.y);
        context.stroke();
      }
    }
  }

  function tick(time) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches || !finePointer.matches || document.body.classList.contains('motion-paused')) return;
    render(time);
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (visible && !document.hidden && !reduced.matches && finePointer.matches && !document.body.classList.contains('motion-paused')) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    } else if (reduced.matches || !finePointer.matches) {
      render(performance.now());
    }
  }
  hero.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const rect = hero.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(hero);
  new ResizeObserver(resize).observe(hero);
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  finePointer.addEventListener('change', () => { resize(); sync(); });
  resize();
})();
