(() => {
  'use strict';
  const capture = document.querySelector('#studio-capture');
  const link = document.querySelector('#capture-link');
  const caption = document.querySelector('#capture-caption');
  const buttons = [...document.querySelectorAll('[data-capture]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const dark = button.dataset.capture === 'dark';
      capture.src = `../assets/form-studio-${dark ? 'dark' : 'light'}.webp`;
      capture.alt = `FORM in ${dark ? 'dark' : 'light'} theme after real OCR: preview canvas, detected text inspector, viewport controls and workspace navigation`;
      link.href = capture.src;
      caption.textContent = `${dark ? 'Dark' : 'Light'} theme · captured after screenshot upload, OCR, correction, Undo and export. Theme controls switch between real captures.`;
      for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    });
  }
})();
