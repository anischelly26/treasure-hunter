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
    thinking.setAttribute('aria-label', 'Retrieving CV context and asking Grok');
    thinking.innerHTML = '<i></i><i></i><i></i>';
    bubble.appendChild(thinking);
    wrapper.appendChild(bubble);

    const meta = document.createElement('div');
    meta.className = 'rag-message__meta';
    meta.textContent = 'RETRIEVING CV PASSAGES // GROK GENERATION';
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

  async function wakeBackend() {
    if (hasWokenBackend) return;
    hasWokenBackend = true;
    setStatus('warming', 'WAKING RENDER SERVICE');
    try {
      const response = await fetchWithTimeout(`${API_URL}/health`, { method: 'GET' }, 55000);
      if (!response.ok) throw new Error('health check failed');
      const health = await response.json();
      setStatus(health.grok_configured ? 'online' : 'error', health.grok_configured ? 'RAG CORE ONLINE' : 'GROK KEY NOT CONFIGURED');
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
    setStatus('warming', 'VECTOR SEARCH + GROK');

    try {
      const response = await fetchWithTimeout(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: clean }),
      }, 70000);

      let payload = {};
      try { payload = await response.json(); } catch (_) { /* ignore invalid JSON */ }

      if (!response.ok) {
        if (response.status === 429) throw new Error('RATE_LIMIT');
        if (response.status === 503) throw new Error('NOT_CONFIGURED');
        throw new Error(payload.detail || `HTTP_${response.status}`);
      }

      loading.remove();
      createMessage(
        'assistant',
        payload.answer || 'No answer was returned.',
        `${String(payload.retrieval_mode || 'RAG').toUpperCase()} // ${payload.model || 'GROK'}`,
        payload.sources || [],
      );
      setStatus('online', 'RAG CORE ONLINE');
    } catch (error) {
      loading.remove();

      let message = 'The CV intelligence service is temporarily unavailable. Please try again shortly.';
      if (error?.name === 'AbortError') {
        message = 'The Render service is taking longer than expected to wake up. Try the question once more in a few seconds.';
      } else if (error?.message === 'RATE_LIMIT') {
        message = 'The public demo rate limit has been reached. Please wait a few minutes before asking another question.';
      } else if (error?.message === 'NOT_CONFIGURED') {
        message = 'The RAG backend is deployed, but its Grok API key has not been configured on Render yet.';
      }

      createMessage('assistant', message, 'SYSTEM NOTICE');
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

  // Initial recruiter-facing greeting is local so the UI feels instant even if Render is asleep.
  createMessage(
    'assistant',
    'Ask me about Anis’s experience, projects, technical skills, education, languages, or PFE objective. I retrieve the most relevant CV passages first, then Grok answers only from that evidence.',
    'ASK_ANIS // CV-GROUNDED RAG',
  );
})();
