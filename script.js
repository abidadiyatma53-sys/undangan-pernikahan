/* ==========================================================================
   SCRIPT UNDANGAN PERNIKAHAN DIGITAL
   Azmi Azra Hasan & Aura Natasya
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC GUEST NAME FROM URL PARAMS (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('guest') || urlParams.get('p') || urlParams.get('nama');
  const guestDisplayElements = document.querySelectorAll('.dynamic-guest-name');
  
  if (guestParam) {
    const formattedGuest = decodeURIComponent(guestParam.replace(/\+/g, ' '));
    guestDisplayElements.forEach(el => {
      el.textContent = formattedGuest;
    });
  }

  // 2. AUDIO & OPEN INVITATION CONTROLLER
  const coverScreen = document.getElementById('cover-screen');
  const btnOpen = document.getElementById('btn-open-invitation');
  const audio = document.getElementById('wedding-audio');
  const audioBtn = document.getElementById('audio-btn');
  let isPlaying = false;

  function playMusic() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      if (audioBtn) {
        audioBtn.classList.add('playing');
        audioBtn.innerHTML = '🎵';
        audioBtn.setAttribute('title', 'Pause Musik (Titik Nadir - Kahitna)');
      }
    }).catch(err => {
      console.log('Audio autoplay prevented:', err);
    });
  }

  function pauseMusic() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    if (audioBtn) {
      audioBtn.classList.remove('playing');
      audioBtn.innerHTML = '🔇';
      audioBtn.setAttribute('title', 'Putar Musik (Titik Nadir - Kahitna)');
    }
  }

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      document.body.classList.remove('locked');
      if (coverScreen) {
        coverScreen.classList.add('opened');
      }
      playMusic();
      
      // Smooth scroll to top of content
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // 3. COUNTDOWN TIMER (10 Oktober 2026, 09:00 WIB)
  const targetWeddingDate = new Date('2026-10-10T09:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');
    const elSeconds = document.getElementById('cd-seconds');

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    if (distance < 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    elDays.textContent = days < 10 ? '0' + days : days;
    elHours.textContent = hours < 10 ? '0' + hours : hours;
    elMinutes.textContent = minutes < 10 ? '0' + minutes : minutes;
    elSeconds.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. COPY BANK ACCOUNT NUMBERS & TOAST
  const toast = document.getElementById('toast-msg');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const accountNum = btn.getAttribute('data-copy');
      if (accountNum) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(accountNum).then(() => {
            showToast('✅ Nomor rekening berhasil disalin!');
          }).catch(() => {
            fallbackCopy(accountNum);
          });
        } else {
          fallbackCopy(accountNum);
        }
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('✅ Nomor rekening berhasil disalin!');
    } catch (e) {
      showToast('Gagal menyalin nomor rekening.');
    }
    document.body.removeChild(tempInput);
  }

  // 5. GALLERY LIGHTBOX
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentImageIndex = 0;
  const imageSources = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      imageSources.push(img.getAttribute('src'));
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxModal || !lightboxImg || imageSources.length === 0) return;
    currentImageIndex = index;
    lightboxImg.src = imageSources[currentImageIndex];
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
  }

  function prevImage() {
    if (imageSources.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
    lightboxImg.src = imageSources[currentImageIndex];
  }

  function nextImage() {
    if (imageSources.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    lightboxImg.src = imageSources[currentImageIndex];
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // 6. WISHES & RSVP GUESTBOOK (LOCAL STORAGE + INITIAL SEED)
  const defaultWishes = [
    {
      name: 'deaa',
      attendance: 'hadir',
      message: 'pyyy wedding kakaaaa 😍💐',
      time: 'Baru saja'
    },
    {
      name: 'Pk',
      attendance: 'hadir',
      message: 'pyy wedinggg kakakaaaaaaaaa smogaa cpt pnya dd biar w jd ounty 😚😚😚',
      time: '1 jam lalu'
    },
    {
      name: 'Bina',
      attendance: 'hadir',
      message: 'Masyaallah auraaaaaaa. Samawa yaa barakallahu fii kumaa 🫶',
      time: '3 jam lalu'
    },
    {
      name: 'akam',
      attendance: 'hadir',
      message: 'selamat menempuh bahtera rumah tangga sahabat.. semoga menjadi keluarga yg sakinah dunia akhirat. 🤗🤲🤘',
      time: '5 jam lalu'
    },
    {
      name: 'Intan',
      attendance: 'hadir',
      message: 'Congrats on your wedding! Happy start & fantastic journey. Samawa yaa 💕',
      time: '1 hari lalu'
    },
    {
      name: 'Aflah mardyah',
      attendance: 'hadir',
      message: 'Selamatt kholill, semoga lancarr sampai hari H jadi keluarga yg sakinnah mawaddah warrohmah aamiinnn',
      time: '1 hari lalu'
    },
    {
      name: 'Nur',
      attendance: 'hadir',
      message: 'Mudah mudahan di lancarkan sampai hari h aura 🤍',
      time: '2 hari lalu'
    },
    {
      name: 'Rita',
      attendance: 'hadir',
      message: 'Masa Allah mudah"n di lancarkan sampai hari H Aur 🥰',
      time: '2 hari lalu'
    },
    {
      name: 'dina',
      attendance: 'ragu',
      message: 'masyaallah lancar sampe hari h auraa 🌸✨',
      time: '2 hari lalu'
    },
    {
      name: 'syahla',
      attendance: 'hadir',
      message: 'omg kakaku 🥹🥹💖💖💐 congratulations happy wedding lof 🌷🌷🌷 congratulations sakinah mawadah warahmah yaa 🤗',
      time: '3 hari lalu'
    },
    {
      name: 'vinaaaa',
      attendance: 'hadir',
      message: 'omgggg auuuuuu, benerann donggg 😍😍😍 semogaa lancarrr sampaii hari H yaa sayangggg 💖💖💖',
      time: '3 hari lalu'
    }
  ];

  const storageKey = 'wedding_wishes_kholil_aura_v1';
  const wishesListContainer = document.getElementById('wishes-list');
  const wishForm = document.getElementById('wish-form');
  const wishesCountEl = document.getElementById('wishes-count');

  function getStoredWishes() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultWishes;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return defaultWishes;
    }
  }

  function renderWishes() {
    if (!wishesListContainer) return;
    const wishes = getStoredWishes();
    wishesListContainer.innerHTML = '';

    if (wishesCountEl) {
      wishesCountEl.textContent = wishes.length;
    }

    wishes.forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-item';

      let badgeHtml = '';
      if (item.attendance === 'hadir') {
        badgeHtml = '<span class="wish-badge badge-hadir">✓ Hadir</span>';
      } else if (item.attendance === 'ragu') {
        badgeHtml = '<span class="wish-badge badge-ragu">? Masih Ragu</span>';
      } else if (item.attendance === 'tidak') {
        badgeHtml = '<span class="wish-badge badge-tidak">✕ Tidak Hadir</span>';
      }

      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(item.name)}</span>
          ${badgeHtml}
        </div>
        <p class="wish-message">${escapeHtml(item.message)}</p>
        <div class="wish-time">${item.time || 'Baru saja'}</div>
      `;
      wishesListContainer.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wish-name');
      const attendanceInput = document.getElementById('wish-attendance');
      const messageInput = document.getElementById('wish-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const attendance = attendanceInput ? attendanceInput.value : 'hadir';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) {
        showToast('Mohon lengkapi nama dan ucapan Anda.');
        return;
      }

      const newWish = {
        name,
        attendance,
        message,
        time: 'Baru saja'
      };

      const currentWishes = getStoredWishes();
      currentWishes.unshift(newWish);
      localStorage.setItem(storageKey, JSON.stringify(currentWishes));

      renderWishes();
      wishForm.reset();
      showToast('💌 Terima kasih atas ucapan & doanya!');
    });
  }

  renderWishes();

  // 7. BOTTOM NAVIGATION ACTIVE SPY
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.bottom-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
