const missionGrid = document.querySelector('.mission-grid');

if (missionGrid && !missionGrid.querySelector('[data-treasure-project]')) {
  const treasureCard = document.createElement('article');
  treasureCard.className = 'mission mission--accent tilt-card';
  treasureCard.dataset.treasureProject = 'true';
  treasureCard.innerHTML = `
    <div class="mission__visual"><b>08</b><span class="visual-grid"></span></div>
    <div class="mission__top"><span>TREASURE HUNTER</span><span class="mission__state">GAME DEV // SDL2</span></div>
    <div class="mission__body">
      <div class="mission__code">4 LEVELS → COMBAT → SHARK BOSS</div>
      <h3>Treasure Hunter</h3>
      <p>Academic C/SDL2 platform game with enemies, traps, health, four levels and a final shark boss.</p>
    </div>
    <div class="mission__tags"><span>C</span><span>SDL2</span><span>PLATFORMER</span><span>GAME DEV</span></div>
    <div class="project-demo-intro">
      <div class="project-demo-intro__label">PLAYABLE PROJECT DEMO</div>
      <p>Play a browser adaptation built from the original team source, level maps, controls and game assets.</p>
      <span class="project-demo-toggle" role="button" tabindex="0" data-treasure-toggle>PLAY TREASURE HUNTER <b>＋</b></span>
      <div class="project-demo-panel" data-treasure-panel>
        <div class="project-demo-head">
          <div><h4>Treasure Hunter</h4><p>Original controls and level structure, adapted to run directly in the portfolio.</p></div>
          <span class="project-proof">SOURCE-BACKED GAME</span>
        </div>
        <div data-treasure-demo></div>
        <a class="project-source-link" href="https://github.com/adam12bT/Treasure-Hunter" target="_blank" rel="noreferrer">VIEW ORIGINAL TEAM SOURCE ↗</a>
      </div>
    </div>`;

  missionGrid.appendChild(treasureCard);
  const count = document.querySelector('.core-metrics div:first-child b');
  if (count) count.textContent = '08';
}
