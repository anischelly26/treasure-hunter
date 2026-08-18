const missionGrid = document.querySelector('.mission-grid');
const hero = document.getElementById('home');

if (missionGrid && hero && !missionGrid.querySelector('[data-treasure-project]')) {
  const treasureCard = document.createElement('article');
  treasureCard.className = 'mission mission--accent tilt-card';
  treasureCard.dataset.treasureProject = 'true';
  treasureCard.tabIndex = 0;
  treasureCard.innerHTML = `
    <div class="mission__visual"><b>08</b><span class="visual-grid"></span></div>
    <div class="mission__top"><span>TREASURE HUNTER</span><span class="mission__state">GAME DEV // SDL2</span></div>
    <div class="mission__body">
      <div class="mission__code">4 LEVELS → COMBAT → SHARK BOSS</div>
      <h3>Treasure Hunter</h3>
      <p>Academic C/SDL2 platform game — now playable as a source-backed browser adaptation.</p>
    </div>
    <div class="mission__tags"><span>C</span><span>SDL2</span><span>PLATFORMER</span><span>GAME DEV</span></div>
    <div class="mission__launch">PLAY REAL DEMO ↗</div>`;

  const launch = () => {
    const panel = document.querySelector('.hero-demo');
    const huntTab = panel?.querySelector('[data-mode="hunt"]');
    if (huntTab) huntTab.click();
    hero.scrollIntoView({ behavior: 'smooth' });
  };

  treasureCard.addEventListener('click', launch);
  treasureCard.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      launch();
    }
  });

  missionGrid.appendChild(treasureCard);
  const count = document.querySelector('.core-metrics div:first-child b');
  if (count) count.textContent = '08';
}
