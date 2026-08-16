(() => {
  const DEFAULT_API_URL = 'https://anischelly26-cv-rag.onrender.com';
  const API_URL = (window.ANIS_RAG_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

  const form = document.getElementById('ragForm');
  const input = document.getElementById('ragInput');
  const messages = document.getElementById('ragMessages');
  const send = document.getElementById('ragSend');
  const status = document.getElementById('ragStatus');
  const statusText = document.getElementById('ragStatusText');
  const suggestionButtons = [...document.querySelectorAll('.rag-question')];

  if (!form || !input || !messages || !send) return;

  let busy = false;
  let hasWokenBackend = false;

  function setStatus(state, label) {
    if (!status || !statusText) return;
    status.dataset.state = state;
    statusText.textContent = label;
  }

  function scrollToLatest() {
    messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
  }

  function createMessage(role, text, meta = '', sources = []) {
    const wrapper = document.createElement('div');
    wrapper.className = `rag-message rag-message--${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'rag-message__bubble';
    bubble.textContent = text;
    wrapper.appendChild(bubble);

    if (sources?.length) {
      const sourceRow = document.createElement('div');
      sourceRow.className = 'rag-sources';
      [...new Set(sources)].forEach((source) => {
        const chip = document.createElement('span');
        chip.className = 'rag-source';
        chip.textContent = source;
        sourceRow.appendChild(chip);
      });
      wrapper.appendChild(sourceRow);
    }

    if (meta) {
      const metaRow = document.createElement('div');
      metaRow.className = 'rag-message__meta';
      metaRow.textContent = meta;
      wrapper.appendChild(metaRow);
    }

    messages.appendChild(wrapper);
    scrollToLatest();
    return wrapper;
  }

  function createThinkingMessage() {
    const wrapper = document.createElement('div');
    wrapper.className = 'rag-message rag-message--assistant';
    const bubble = document.createElement('div');
    bubble.className = 'rag-message__bubble';
    const thinking = document.createElement('span');
    thinking.className = 'rag-thinking';
    thinking.setAttribute('aria-label', 'Retrieving CV context and generating a grounded answer');
    thinking.innerHTML = '<i></i><i></i><i></i>';
    bubble.appendChild(thinking);
    wrapper.appendChild(bubble);
    const meta = document.createElement('div');
    meta.className = 'rag-message__meta';
    meta.textContent = 'RETRIEVING CV PASSAGES // GROUNDED ANSWER';
    wrapper.appendChild(meta);
    messages.appendChild(wrapper);
    scrollToLatest();
    return wrapper;
  }

  async function fetchWithTimeout(url, options = {}, timeoutMs = 65000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  function friendlyError(code) {
    const map = {
      RETRIEVER_NOT_READY: 'The CV vector retriever is not ready yet. The Render service may still be warming up.',
      PUBLIC_RATE_LIMIT: 'The public CV demo rate limit has been reached. Please wait a few minutes.',
    };
    return map[code] || 'The CV intelligence service is temporarily unavailable. Please try again shortly.';
  }

  async function wakeBackend() {
    if (hasWokenBackend) return;
    hasWokenBackend = true;
    setStatus('warming', 'WAKING RENDER SERVICE');
    try {
      const response = await fetchWithTimeout(`${API_URL}/health`, { method: 'GET' }, 55000);
      if (!response.ok) throw new Error('HEALTH_FAILED');
      const health = await response.json();
      if (!health.retriever_ready) {
        setStatus('error', 'VECTOR RETRIEVER NOT READY');
      } else {
        const engine = health.grok_configured ? 'GROK + CV RAG' : 'CV RAG FALLBACK';
        setStatus('online', `${engine} ONLINE // V${health.version || '?'}`);
      }
    } catch (_) {
      setStatus('error', 'BACKEND OFFLINE');
    }
  }

  async function ask(question) {
    const clean = String(question || '').trim();
    if (!clean || busy) return;

    busy = true;
    send.disabled = true;
    input.disabled = true;

    createMessage('user', clean, 'RECRUITER QUERY');
    const loading = createThinkingMessage();
    setStatus('warming', 'VECTOR SEARCH + ANSWER');

    try {
      const response = await fetchWithTimeout(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: clean }),
      }, 70000);

      let payload = {};
      try { payload = await response.json(); } catch (_) { /* invalid JSON */ }

      if (!response.ok) {
        const code = payload.detail || (response.status === 429 ? 'PUBLIC_RATE_LIMIT' : `HTTP_${response.status}`);
        const err = new Error(code);
        err.code = code;
        throw err;
      }

      loading.remove();
      createMessage(
        'assistant',
        payload.answer || 'No answer was returned.',
        `${String(payload.retrieval_mode || 'RAG').toUpperCase()} // ${payload.model || 'CV RAG'}`,
        payload.sources || [],
      );
      setStatus('online', 'RAG CORE ONLINE');
    } catch (error) {
      loading.remove();
      let message;
      if (error?.name === 'AbortError') {
        message = 'The Render service is taking longer than expected to wake up. Try once more in a few seconds.';
      } else {
        message = friendlyError(error?.code || error?.message);
      }
      createMessage('assistant', message, `SYSTEM NOTICE // ${error?.code || error?.message || 'NETWORK'}`);
      setStatus('error', 'SERVICE CHECK REQUIRED');
    } finally {
      busy = false;
      send.disabled = false;
      input.disabled = false;
      input.value = '';
      input.focus();
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });

  suggestionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      wakeBackend();
      ask(button.dataset.question || button.textContent);
    });
  });

  input.addEventListener('focus', wakeBackend, { once: true });

  createMessage(
    'assistant',
    'Ask me about Anis’s experience, projects, technical skills, education, languages, or PFE objective. I retrieve the most relevant CV passages and answer only from that evidence. Grok is used when available; a local grounded fallback keeps the assistant working if the external model is unavailable.',
    'ASK_ANIS // CV-GROUNDED RAG',
  );
})();
