// Acessibilidade: alterna tema e controla tamanho do texto com persistência via localStorage

(function(){
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const increaseBtn = document.getElementById('increase-font');
  const decreaseBtn = document.getElementById('decrease-font');
  const resetBtn = document.getElementById('reset-font');

  const STORAGE_KEY = 'visao_site_settings_v1';

  // padrão de configuração
  const defaultSettings = {
    theme: matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    fontScale: 1
  };

  // carregar configuração
  function loadSettings(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return defaultSettings;
  }

  function saveSettings(s){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }catch(e){}
  }

  // aplicar tema
  function applyTheme(theme){
    if(theme === 'dark'){
      body.classList.add('dark-theme');
      themeToggle.setAttribute('aria-pressed','true');
      themeToggle.textContent = '🌞 Claro';
    } else {
      body.classList.remove('dark-theme');
      themeToggle.setAttribute('aria-pressed','false');
      themeToggle.textContent = '🌗 Escuro';
    }
  }

  // aplicar escala de fonte (entre 0.85 e 1.5)
  function applyFontScale(scale){
    const clamped = Math.max(0.85, Math.min(1.5, scale));
    document.documentElement.style.setProperty('--font-scale', clamped);
  }

  // carregar e aplicar no início
  let settings = loadSettings();
  applyTheme(settings.theme);
  applyFontScale(settings.fontScale);

  // Toggle theme handler
  themeToggle.addEventListener('click', () => {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    applyTheme(settings.theme);
    saveSettings(settings);
  });

  // Font handlers
  increaseBtn.addEventListener('click', () => {
    settings.fontScale = Math.min(1.5, +(settings.fontScale + 0.05).toFixed(2));
    applyFontScale(settings.fontScale);
    saveSettings(settings);
  });

  decreaseBtn.addEventListener('click', () => {
    settings.fontScale = Math.max(0.85, +(settings.fontScale - 0.05).toFixed(2));
    applyFontScale(settings.fontScale);
    saveSettings(settings);
  });

  resetBtn.addEventListener('click', () => {
    settings.fontScale = 1;
    applyFontScale(settings.fontScale);
    saveSettings(settings);
  });

  // Acessibilidade por teclado: permitir alternar tema com "T" e alterar texto com +/- (quando focado fora de inputs)
  document.addEventListener('keydown', (e) => {
    if(e.target && ['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if(e.key === 'T' || e.key === 't') themeToggle.click();
    if(e.key === '+') increaseBtn.click();
    if(e.key === '-') decreaseBtn.click();
    if(e.key === '0') resetBtn.click();
  });

  // Melhora: detecta mudança no prefers-color-scheme e, se o usuário não escolheu manualmente, atualiza
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener && mq.addEventListener('change', (ev) => {
      // só muda se user ainda estiver no padrão (igual ao defaultSettings)
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw){
        settings.theme = ev.matches ? 'dark' : 'light';
        applyTheme(settings.theme);
      }
    });
  } catch(e){/* navegadores antigos ignoram */}

})();
