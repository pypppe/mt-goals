// Credentials stored in localStorage only

(function () {
  const LS_USER = 'mt_username';
  const LS_KEY  = 'mt_ape_key';
  const API     = 'https://api.monkeytype.com';

  const style = document.createElement('style');
  style.textContent = `
    #mt-widget {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      font-family: 'Roboto Mono', monospace;
    }

    #mt-connect-btn {
      background: #2b2d31;
      border: none;
      border-radius: 8px;
      color: rgba(255,255,255,0.45);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.78rem;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
      animation: mtFadeIn 0.25s ease;
    }
    #mt-connect-btn:hover {
      background: #35373d;
      color: rgba(255,255,255,0.75);
    }
    #mt-connect-btn svg {
      width: 13px;
      height: 13px;
      flex-shrink: 0;
    }

    #mt-widget-card {
      background: #2b2d31;
      border-radius: 10px;
      padding: 11px 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
      max-width: 230px;
      animation: mtFadeIn 0.25s ease;
    }
    #mt-widget-card:hover { background: #35373d; }

    .mt-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      flex-shrink: 0;
      object-fit: cover;
    }
    .mt-avatar-placeholder {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #3a3c42;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.35);
      font-size: 0.9rem;
      font-weight: 500;
    }

    #mt-widget-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    #mt-widget-name {
      color: rgba(255,255,255,0.88);
      font-size: 0.82rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #mt-widget-stats {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .mt-stat { display: flex; flex-direction: column; }
    .mt-stat-value {
      color: #e2b714;
      font-size: 0.8rem;
      font-weight: 500;
      line-height: 1.2;
    }
    .mt-stat-label {
      color: rgba(255,255,255,0.3);
      font-size: 0.6rem;
      line-height: 1.2;
    }
    .mt-stat-divider {
      width: 1px;
      height: 20px;
      background: rgba(255,255,255,0.1);
      flex-shrink: 0;
    }
    .mt-no-stats {
      color: rgba(255,255,255,0.3);
      font-size: 0.68rem;
    }

    #mt-widget-disconnect {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: #313338;
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.4);
      font-size: 0.55rem;
      transition: background 0.15s, color 0.15s;
      z-index: 10;
      line-height: 1;
      padding: 0;
    }
    #mt-widget:hover #mt-widget-disconnect { display: flex; }
    #mt-widget-disconnect:hover {
      background: #e2b714;
      color: #1a1b1e;
      border-color: #e2b714;
    }

    .mt-pulse {
      background: rgba(255,255,255,0.08) !important;
      border-radius: 3px;
      color: transparent !important;
      animation: mtPulse 1.4s ease infinite;
    }

    #mt-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: mtFadeIn 0.18s ease;
      padding: 20px;
    }
    #mt-modal {
      background: #2b2d31;
      border-radius: 12px;
      padding: 26px 26px 22px;
      width: 100%;
      max-width: 390px;
      font-family: 'Roboto Mono', monospace;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      animation: mtSlideUp 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    #mt-modal-title {
      color: #fff;
      font-size: 0.95rem;
      font-weight: 500;
    }
    #mt-modal-desc {
      color: rgba(255,255,255,0.4);
      font-size: 0.73rem;
      line-height: 1.65;
      margin-top: -10px;
    }
    #mt-modal-desc a {
      color: #e2b714;
      text-decoration: none;
    }
    #mt-modal-desc a:hover { text-decoration: underline; }

    .mt-field { display: flex; flex-direction: column; gap: 5px; }
    .mt-field label {
      color: rgba(255,255,255,0.45);
      font-size: 0.68rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .mt-field input {
      background: #313338;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px;
      color: #fff;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.83rem;
      padding: 9px 11px;
      outline: none;
      transition: border-color 0.15s;
    }
    .mt-field input:focus { border-color: rgba(226,183,20,0.6); }
    .mt-field input::placeholder { color: rgba(255,255,255,0.18); }

    #mt-modal-error {
      color: #f04747;
      font-size: 0.72rem;
      display: none;
      margin-top: -10px;
    }
    #mt-modal-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    #mt-modal-cancel {
      background: none;
      border: none;
      color: rgba(255,255,255,0.35);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    #mt-modal-cancel:hover {
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.65);
    }
    #mt-modal-save {
      background: #e2b714;
      border: none;
      border-radius: 6px;
      color: #1a1b1e;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 18px;
      transition: background 0.15s, opacity 0.15s;
    }
    #mt-modal-save:hover:not(:disabled) { background: #f0c620; }
    #mt-modal-save:disabled { opacity: 0.45; cursor: default; }

    #mt-disc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: mtFadeIn 0.18s ease;
      padding: 20px;
    }
    #mt-disc-modal {
      background: #2b2d31;
      border-radius: 12px;
      padding: 28px 26px 24px;
      width: 100%;
      max-width: 320px;
      font-family: 'Roboto Mono', monospace;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      animation: mtSlideUp 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    #mt-disc-icon {
      opacity: 0.5;
      width: 40px;
      height: 40px;
      margin-top: 2px;
    }
    #mt-disc-icon svg {
      width: 40px;
      height: 40px;
    }
    #mt-disc-text {
      color: rgba(255,255,255,0.8);
      font-size: 0.82rem;
      text-align: center;
      line-height: 1.55;
    }
    #mt-disc-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      width: 100%;
    }
    #mt-disc-yes {
      background: #e2b714;
      border: none;
      border-radius: 6px;
      color: #1a1b1e;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 16px;
      transition: background 0.15s;
    }
    #mt-disc-yes:hover { background: #f0c620; }
    #mt-disc-no {
      background: #c0392b;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 16px;
      transition: background 0.15s;
    }
    #mt-disc-no:hover { background: #d44233; }

    @keyframes mtFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes mtSlideUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes mtPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.35; }
    }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'mt-widget';
  document.body.appendChild(widget);

  async function api(path, apeKey) {
    const headers = apeKey ? { Authorization: `ApeKey ${apeKey}` } : {};
    const res = await fetch(`${API}${path}`, { headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(String(res.status));
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json;
  }

  function makeAvatar(letter) {
    const el = document.createElement('div');
    el.className = 'mt-avatar-placeholder';
    el.textContent = (letter || '?').toUpperCase();
    return el;
  }

  function makeStat(value, label) {
    const wrap = document.createElement('div');
    wrap.className = 'mt-stat';
    const v = document.createElement('div');
    v.className = 'mt-stat-value';
    v.textContent = value;
    const l = document.createElement('div');
    l.className = 'mt-stat-label';
    l.textContent = label;
    wrap.appendChild(v);
    wrap.appendChild(l);
    return wrap;
  }

  function bestWpm(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return Math.round(arr.reduce((best, r) => r.wpm > best ? r.wpm : best, 0));
  }
function renderConnectBtn(errorMsg) {
    widget.innerHTML = '';
    const btn = document.createElement('button');
    btn.id = 'mt-connect-btn';
    if (errorMsg) {
      btn.style.color = '#f04747';
      btn.textContent = errorMsg;
    } else {
      btn.innerHTML = `
        <svg viewBox="-690 -1040 320 200" fill="white" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M -430 -910 L -430 -910 C -424.481 -910 -420 -905.519 -420 -900 L -420 -900 C -420 -894.481 -424.481 -890 -430 -890 L -430 -890 C -435.519 -890 -440 -894.481 -440 -900 L -440 -900 C -440 -905.519 -435.519 -910 -430 -910 Z"/>
            <path d="M -570 -910 L -510 -910 C -504.481 -910 -500 -905.519 -500 -900 L -500 -900 C -500 -894.481 -504.481 -890 -510 -890 L -570 -890 C -575.519 -890 -580 -894.481 -580 -900 L -580 -900 C -580 -905.519 -575.519 -910 -570 -910 Z"/>
            <path d="M -590 -970 L -590 -970 C -584.481 -970 -580 -965.519 -580 -960 L -580 -940 C -580 -934.481 -584.481 -930 -590 -930 L -590 -930 C -595.519 -930 -600 -934.481 -600 -940 L -600 -960 C -600 -965.519 -595.519 -970 -590 -970 Z"/>
            <path d="M -639.991 -960.515 C -639.72 -976.836 -626.385 -990 -610 -990 L -610 -990 C -602.32 -990 -595.31 -987.108 -590 -982.355 C -584.69 -987.108 -577.68 -990 -570 -990 L -570 -990 C -553.615 -990 -540.28 -976.836 -540.009 -960.515 C -540.001 -960.345 -540 -960.172 -540 -960 L -540 -960 L -540 -940 C -540 -934.481 -544.481 -930 -550 -930 L -550 -930 C -555.519 -930 -560 -934.481 -560 -940 L -560 -960 L -560 -960 C -560 -965.519 -564.481 -970 -570 -970 C -575.519 -970 -580 -965.519 -580 -960 L -580 -960 L -580 -960 L -580 -940 C -580 -934.481 -584.481 -930 -590 -930 L -590 -930 C -595.519 -930 -600 -934.481 -600 -940 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 C -600 -965.519 -604.481 -970 -610 -970 C -615.519 -970 -620 -965.519 -620 -960 L -620 -960 L -620 -940 C -620 -934.481 -624.481 -930 -630 -930 L -630 -930 C -635.519 -930 -640 -934.481 -640 -940 L -640 -960 L -640 -960 C -640 -960.172 -639.996 -960.344 -639.991 -960.515 Z"/>
            <path d="M -460 -930 L -460 -900 C -460 -894.481 -464.481 -890 -470 -890 L -470 -890 C -475.519 -890 -480 -894.481 -480 -900 L -480 -930 L -508.82 -930 C -514.99 -930 -520 -934.481 -520 -940 L -520 -940 C -520 -945.519 -514.99 -950 -508.82 -950 L -431.18 -950 C -425.01 -950 -420 -945.519 -420 -940 L -420 -940 C -420 -934.481 -425.01 -930 -431.18 -930 L -460 -930 Z"/>
            <path d="M -470 -990 L -430 -990 C -424.481 -990 -420 -985.519 -420 -980 L -420 -980 C -420 -974.481 -424.481 -970 -430 -970 L -470 -970 C -475.519 -970 -480 -974.481 -480 -980 L -480 -980 C -480 -985.519 -475.519 -990 -470 -990 Z"/>
            <path d="M -630 -910 L -610 -910 C -604.481 -910 -600 -905.519 -600 -900 L -600 -900 C -600 -894.481 -604.481 -890 -610 -890 L -630 -890 C -635.519 -890 -640 -894.481 -640 -900 L -640 -900 C -640 -905.519 -635.519 -910 -630 -910 Z"/>
            <path d="M -515 -990 L -510 -990 C -504.481 -990 -500 -985.519 -500 -980 L -500 -980 C -500 -974.481 -504.481 -970 -510 -970 L -515 -970 C -520.519 -970 -525 -974.481 -525 -980 L -525 -980 C -525 -985.519 -520.519 -990 -515 -990 Z"/>
            <path d="M -660 -910 L -680 -910 L -680 -980 C -680 -1007.596 -657.596 -1030 -630 -1030 L -430 -1030 C -402.404 -1030 -380 -1007.596 -380 -980 L -380 -900 C -380 -872.404 -402.404 -850 -430 -850 L -630 -850 C -657.596 -850 -680 -872.404 -680 -900 L -680 -920 L -660 -920 L -660 -900 C -660 -883.443 -646.557 -870 -630 -870 L -430 -870 C -413.443 -870 -400 -883.443 -400 -900 L -400 -980 C -400 -996.557 -413.443 -1010 -430 -1010 L -630 -1010 C -646.557 -1010 -660 -996.557 -660 -980 L -660 -910 Z"/>
          </g>
        </svg>
        connect mt`;
    }
    btn.addEventListener('click', openModal);
    widget.appendChild(btn);
  }

  function renderSkeleton(username) {
    widget.innerHTML = '';
    const card = document.createElement('div');
    card.id = 'mt-widget-card';

    const info = document.createElement('div');
    info.id = 'mt-widget-info';

    const name = document.createElement('div');
    name.id = 'mt-widget-name';
    name.className = 'mt-pulse';
    name.textContent = username;
    name.style.minWidth = '60px';

    const statsRow = document.createElement('div');
    statsRow.id = 'mt-widget-stats';

    const s1 = makeStat('000', '15s pb');
    const s2 = makeStat('000', '60s pb');
    s1.querySelector('.mt-stat-value').classList.add('mt-pulse');
    s2.querySelector('.mt-stat-value').classList.add('mt-pulse');

    const div = document.createElement('div');
    div.className = 'mt-stat-divider';

    statsRow.appendChild(s1);
    statsRow.appendChild(div);
    statsRow.appendChild(s2);

    info.appendChild(name);
    info.appendChild(statsRow);
    card.appendChild(makeAvatar(username[0]));
    card.appendChild(info);
    widget.appendChild(card);
  }

  function openDisconnectConfirm() {
    const overlay = document.createElement('div');
    overlay.id = 'mt-disc-overlay';
    overlay.innerHTML = `
      <div id="mt-disc-modal">
        <div id="mt-disc-icon">
          <svg fill="#ffffff" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z" style="fill-rule:nonzero;"></path>
            <path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z" style="fill-rule:nonzero;"></path>
          </svg>
        </div>
        <div id="mt-disc-text">Are you sure you want to disconnect?</div>
        <div id="mt-disc-actions">
          <button id="mt-disc-yes">Yes I'm sure!</button>
          <button id="mt-disc-no">No Don't!</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const yesBtn = document.getElementById('mt-disc-yes');
    const noBtn  = document.getElementById('mt-disc-no');

    const close = () => overlay.remove();

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const escHandler = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    noBtn.addEventListener('click', close);

    yesBtn.addEventListener('click', () => {
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_KEY);
      close();
      renderConnectBtn();
    });
  }

  function renderCard(username, pb15, pb60, discordId, discordAvatar) {
    widget.innerHTML = '';

    const card = document.createElement('a');
    card.id = 'mt-widget-card';
    card.href = `https://monkeytype.com/profile/${encodeURIComponent(username)}`;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.title = 'View Monkeytype profile';
    
    let avatarEl;
    if (discordId && discordAvatar) {
      const img = document.createElement('img');
      img.className = 'mt-avatar';
      img.src = `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png?size=64`;
      img.alt = username;
      img.onerror = () => img.replaceWith(makeAvatar(username[0]));
      avatarEl = img;
    } else {
      avatarEl = makeAvatar(username[0]);
    }

    const info = document.createElement('div');
    info.id = 'mt-widget-info';

    const name = document.createElement('div');
    name.id = 'mt-widget-name';
    name.textContent = username;

    const statsRow = document.createElement('div');
    statsRow.id = 'mt-widget-stats';

    if (pb15 !== null || pb60 !== null) {
      if (pb15 !== null) statsRow.appendChild(makeStat(pb15, '15s pb'));
      if (pb15 !== null && pb60 !== null) {
        const d = document.createElement('div');
        d.className = 'mt-stat-divider';
        statsRow.appendChild(d);
      }
      if (pb60 !== null) statsRow.appendChild(makeStat(pb60, '60s pb'));
    } else {
      const empty = document.createElement('span');
      empty.className = 'mt-no-stats';
      empty.textContent = 'no results yet';
      statsRow.appendChild(empty);
    }

    info.appendChild(name);
    info.appendChild(statsRow);
    card.appendChild(avatarEl);
    card.appendChild(info);

    const disc = document.createElement('button');
    disc.id = 'mt-widget-disconnect';
    disc.title = 'Disconnect';
    disc.textContent = '✕';
    disc.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openDisconnectConfirm();
    });

    widget.appendChild(card);
    widget.appendChild(disc);
  }

  async function loadStats(username, apeKey) {
    renderSkeleton(username);

    try {
      const pbRes = await api('/users/personalBests?mode=time', apeKey);
      const timeData = pbRes?.data?.time ?? {};
      const pb15 = bestWpm(timeData['15']);
      const pb60 = bestWpm(timeData['60']);

      let discordId = null, discordAvatar = null;
      try {
        const profileRes = await api(`/users/${encodeURIComponent(username)}/profile`, apeKey);
        discordId     = profileRes?.data?.discordId     ?? null;
        discordAvatar = profileRes?.data?.discordAvatar ?? null;
      } catch (_) {}

      renderCard(username, pb15, pb60, discordId, discordAvatar);

    } catch (err) {
      const s = err.status;
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_KEY);
      if (s === 471) {
        renderConnectBtn('key not activated — reconnect');
      } else if (s === 470 || s === 472) {
        renderConnectBtn('invalid key — reconnect');
      } else if (s === 401 || s === 403) {
        renderConnectBtn('key expired — reconnect');
      } else {
        localStorage.setItem(LS_USER, username);
        localStorage.setItem(LS_KEY, apeKey);
        renderCard(username, null, null, null, null);
        return;
      }
      setTimeout(renderConnectBtn, 4000);
    }
  }

  function openModal() {
    const overlay = document.createElement('div');
    overlay.id = 'mt-modal-overlay';
    overlay.innerHTML = `
      <div id="mt-modal">
        <div id="mt-modal-title">Connect Monkeytype</div>
        <div id="mt-modal-desc">
          Your credentials are saved only in your browser.<br><br>
          Get your Ape Key from
          <a href="https://monkeytype.com/account-settings?tab=apeKeys" target="_blank" rel="noopener">
            account settings → Ape Keys
          </a>.
          Make sure the key is <strong style="color:rgba(255,255,255,0.55)">activated</strong> (tick the checkbox next to it).
        </div>
        <div class="mt-field">
          <label>Monkeytype username</label>
          <input id="mt-input-user" type="text" placeholder="your username" autocomplete="off" spellcheck="false"/>
        </div>
        <div class="mt-field">
          <label>Ape Key</label>
          <input id="mt-input-key" type="password" placeholder="paste your Ape Key here" autocomplete="off" spellcheck="false"/>
        </div>
        <div id="mt-modal-error"></div>
        <div id="mt-modal-actions">
          <button id="mt-modal-cancel">cancel</button>
          <button id="mt-modal-save">connect</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const userInput = document.getElementById('mt-input-user');
    const keyInput  = document.getElementById('mt-input-key');
    const saveBtn   = document.getElementById('mt-modal-save');
    const cancelBtn = document.getElementById('mt-modal-cancel');
    const errorEl   = document.getElementById('mt-modal-error');

    userInput.value = localStorage.getItem(LS_USER) || '';
    keyInput.value  = localStorage.getItem(LS_KEY)  || '';
    userInput.focus();

    const close = () => overlay.remove();
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const escHandler = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    [userInput, keyInput].forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });
    });

    saveBtn.addEventListener('click', async () => {
      const username = userInput.value.trim();
      const apeKey   = keyInput.value.trim();

      errorEl.style.display = 'none';

      if (!username || !apeKey) {
        errorEl.textContent = 'Please fill in both fields.';
        errorEl.style.display = 'block';
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'connecting...';

      try {
        await api('/users/personalBests?mode=time', apeKey);
        localStorage.setItem(LS_USER, username);
        localStorage.setItem(LS_KEY, apeKey);
        close();
        loadStats(username, apeKey);
      } catch (err) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'connect';
        const s = err.status;
        if (s === 471) {
          errorEl.textContent = 'Key is not activated. Tick the checkbox next to it in account settings.';
        } else if (s === 470 || s === 472) {
          errorEl.textContent = 'Invalid Ape Key — double-check you copied it fully.';
        } else if (s === 401 || s === 403) {
          errorEl.textContent = 'Unauthorized. Check your Ape Key and try again.';
        } else {
          errorEl.textContent = `Could not connect (${s ?? 'network error'}). Try again.`;
        }
        errorEl.style.display = 'block';
      }
    });
  }

  const savedUser = localStorage.getItem(LS_USER);
  const savedKey  = localStorage.getItem(LS_KEY);

  if (savedUser && savedKey) {
    loadStats(savedUser, savedKey);
  } else {
    renderConnectBtn();
  }

})();
