// Texte défilant
    const roles = ["Géomaticien","Chargé d'études SIG","Analyste territorial","Urbaniste data","Chef de projet SIG","Consultant géomatique"];
    let idx = 0;
    const word = document.getElementById('changing-word');
    function changeWord() {
        idx = (idx + 1) % roles.length;
        word.style.opacity = '0';
        setTimeout(() => { word.textContent = roles[idx]; word.style.opacity = '1'; }, 200);
    }
    setInterval(changeWord, 2200);

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Nav active au scroll
    const sections = document.querySelectorAll('section[id], div[id]');
    const links = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (scrollY >= s.offsetTop - 120) current = s.id; });
        links.forEach(l => {
            l.style.color = '';
            if (l.getAttribute('href').includes(current)) l.style.color = 'var(--teal-light)';
        });
    });

    // Modals
    function openModal(id) {
        const m = document.getElementById(id + '-modal');
        if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
    }
    function closeModal(id) {
        const m = document.getElementById(id + '-modal');
        if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
    }
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) closeModal(m.id.replace('-modal','')); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id.replace('-modal','')));
    });


/* ═══════════════════════════════════ */


(function() {
    var target = new Date('2026-09-01T00:00:00');
    var start = new Date('2026-01-01T00:00:00');
    var totalMs = target - start;

    var messages = [
        "Chaque seconde compte. Mais votre appel peut partir maintenant.",
        "Disponible dès septembre — joignable dès aujourd'hui.",
        "2 ans d'expérience terrain. Prêt à rejoindre votre équipe.",
        "Les données n'attendent pas. Ni les bonnes candidatures.",
        "Master 2 Géomatique · Mobile France entière · Disponible sept. 2026."
    ];
    var msgIdx = 0;

    function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }

    function updateCountdown() {
        var now = new Date();
        var diff = target - now;
        if (diff <= 0) {
            ['days','hours','minutes','seconds'].forEach(function(u) {
                var el = document.getElementById('cd-' + u);
                if (el) el.textContent = '00';
            });
            var msg = document.getElementById('cd-message');
            if (msg) msg.textContent = 'Gloire Marcellin est disponible dès maintenant !';
            var bar = document.getElementById('cd-bar');
            if (bar) bar.style.width = '100%';
            var pct = document.getElementById('cd-pct');
            if (pct) pct.textContent = '100%';
            return;
        }

        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);

        var elD = document.getElementById('cd-days');
        var elH = document.getElementById('cd-hours');
        var elM = document.getElementById('cd-minutes');
        var elS = document.getElementById('cd-seconds');
        if (elD) elD.textContent = pad(d);
        if (elH) elH.textContent = pad(h);
        if (elM) elM.textContent = pad(m);
        if (elS) elS.textContent = pad(s);

        var bD = document.getElementById('bar-days');
        var bH = document.getElementById('bar-hours');
        var bM = document.getElementById('bar-minutes');
        var bS = document.getElementById('bar-seconds');
        if (bD) bD.style.width = (100 - (d / 365 * 100)).toFixed(1) + '%';
        if (bH) bH.style.width = ((23 - h) / 23 * 100).toFixed(1) + '%';
        if (bM) bM.style.width = ((59 - m) / 59 * 100).toFixed(1) + '%';
        if (bS) bS.style.width = ((59 - s) / 59 * 100).toFixed(1) + '%';

        var elapsed = totalMs - diff;
        var pctVal = Math.min(100, Math.round(elapsed / totalMs * 100));
        var barEl = document.getElementById('cd-bar');
        var pctEl = document.getElementById('cd-pct');
        if (barEl) barEl.style.width = pctVal + '%';
        if (pctEl) pctEl.textContent = pctVal + '%';
    }

    function rotateMessage() {
        var el = document.getElementById('cd-message');
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(function() {
            msgIdx = (msgIdx + 1) % messages.length;
            el.textContent = messages[msgIdx];
            el.style.opacity = '1';
        }, 400);
    }

    var msgEl = document.getElementById('cd-message');
    if (msgEl) msgEl.textContent = messages[0];

    updateCountdown();
    setInterval(updateCountdown, 1000);
    setInterval(rotateMessage, 4000);
})();


/* ═══════════════════════════════════ */


(function() {

    /* ═══ 1. CANVAS PARTICULES GÉOGRAPHIQUES ═══ */
    const canvas = document.getElementById('geo-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, pts = [], lines = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function randPt() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1,
            pulse: Math.random() * Math.PI * 2
        };
    }

    for (let i = 0; i < 60; i++) pts.push(randPt());

    function drawCanvas() {
        ctx.clearRect(0, 0, W, H);

        /* Points */
        pts.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            const alpha = 0.4 + 0.3 * Math.sin(p.pulse);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(26,143,163,${alpha})`;
            ctx.fill();
        });

        /* Lignes entre points proches */
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x;
                const dy = pts[i].y - pts[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(26,143,163,${0.15 * (1 - dist/130)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        /* Grille de coordonnées légère */
        ctx.strokeStyle = 'rgba(26,143,163,0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 80) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 80) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        requestAnimationFrame(drawCanvas);
    }
    drawCanvas();


    /* ═══ 2. CURSEUR PERSONNALISÉ ═══ */
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    function animRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button, .portfolio-card, .tool-badge, .formation-card, .value-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });


    /* ═══ 3. BARRE PROGRESSION SCROLL ═══ */
    const prog = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const total = document.body.scrollHeight - window.innerHeight;
        prog.style.width = (window.scrollY / total * 100) + '%';
    });


    /* ═══ 4. SCROLL REVEAL ═══ */
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => obs.observe(el));


    /* ═══ 5. STATS COMPTEUR ANIMÉ ═══ */
    const statNums = document.querySelectorAll('.stat-num');
    const statTargets = [2, 8, 3];
    let statsDone = false;

    const statObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !statsDone) {
                statsDone = true;
                statNums.forEach((el, i) => {
                    let count = 0;
                    const target = statTargets[i];
                    const step = () => {
                        count++;
                        el.textContent = count + '+';
                        if (count < target) setTimeout(step, 200);
                    };
                    setTimeout(step, i * 300);
                });
            }
        });
    }, { threshold: 0.5 });

    if (statNums.length) statObs.observe(statNums[0].closest('.hero-stats') || statNums[0]);


    /* ═══ 6. PARALLAX PHOTO ═══ */
    const photoFrame = document.querySelector('.photo-frame');
    window.addEventListener('mousemove', e => {
        if (!photoFrame) return;
        const rx2 = (e.clientX / window.innerWidth - 0.5) * 10;
        const ry2 = (e.clientY / window.innerHeight - 0.5) * 10;
        photoFrame.style.transform = `perspective(600px) rotateY(${rx2}deg) rotateX(${-ry2}deg)`;
    });


    /* ═══ 7. COORDONNÉES LIVE ═══ */
    const liveCoord = document.getElementById('live-coord');
    if (liveCoord) {
        window.addEventListener('mousemove', e => {
            const lat = (48.9 + (e.clientY / window.innerHeight) * 0.1).toFixed(4);
            const lng = (2.1 + (e.clientX / window.innerWidth) * 0.1).toFixed(4);
            liveCoord.textContent = lat + '°N · ' + lng + '°E';
        });
    }


    /* ═══ 8. MODE CLAIR/SOMBRE ═══ */
    const toggle = document.getElementById('modeToggle');
    let light = false;
    if (toggle) {
        toggle.addEventListener('click', () => {
            light = !light;
            document.body.classList.toggle('light-mode', light);
            toggle.textContent = light ? '🌙' : '☀️';
        });
    }


    /* ═══ 9. CARTE LEAFLET ═══ */
    const mapEl = document.getElementById('map-contact');
    if (mapEl) {
        const map = L.map('map-contact', { zoomControl: false, scrollWheelZoom: false }).setView([48.9373, 2.1575], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap · © CartoDB',
            maxZoom: 18
        }).addTo(map);
        const icon = L.divIcon({
            html: '<div style="width:14px;height:14px;background:#1a8fa3;border-radius:50%;border:3px solid #28b5ce;box-shadow:0 0 0 6px rgba(26,143,163,0.2);"></div>',
            iconSize: [14, 14], iconAnchor: [7, 7], className: ''
        });
        L.marker([48.9373, 2.1575], { icon })
            .bindPopup('<b>Gloire Mbamba</b><br>Sartrouville, Yvelines<br><i style="color:#1a8fa3">Mobile France entière</i>')
            .addTo(map).openPopup();
    }

})();


/* ═══════════════════════════════════ */


(function() {
    const imgs = [
        { src: 'images/IMG_3236.jpeg', caption: '🏗️ Visite de site · Étude d'implantation antennes télécom · Sartrouville' },
        { src: 'images/IMG_3246.jpeg', caption: '📡 Reconnaissance terrain · Analyse des contraintes de site' },
        { src: 'images/IMG_6177.jpeg', caption: '🗺️ Analyse spatiale sur ArcGIS · Double écran · Hydre Ingénierie' },
        { src: 'images/IMG_6180.jpeg', caption: '💻 Traitement de données géographiques · QGIS · Hydre Ingénierie' },
    ];
    let current = 0;

    window.openActionModal = function(i) {
        current = i;
        document.getElementById('action-modal-img').src = imgs[i].src;
        document.getElementById('action-modal-caption').textContent = imgs[i].caption;
        document.getElementById('action-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    window.closeActionModal = function() {
        document.getElementById('action-modal').classList.remove('active');
        document.body.style.overflow = '';
    };
    window.prevAction = function() {
        current = (current - 1 + imgs.length) % imgs.length;
        document.getElementById('action-modal-img').src = imgs[current].src;
        document.getElementById('action-modal-caption').textContent = imgs[current].caption;
    };
    window.nextAction = function() {
        current = (current + 1) % imgs.length;
        document.getElementById('action-modal-img').src = imgs[current].src;
        document.getElementById('action-modal-caption').textContent = imgs[current].caption;
    };

    // Navigation clavier
    document.addEventListener('keydown', e => {
        if (!document.getElementById('action-modal').classList.contains('active')) return;
        if (e.key === 'ArrowLeft') window.prevAction();
        if (e.key === 'ArrowRight') window.nextAction();
        if (e.key === 'Escape') window.closeActionModal();
    });
})();
