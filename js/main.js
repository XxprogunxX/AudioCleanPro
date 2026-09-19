/**
 * AUDIOCLEAN PRO — MAIN COMMERCIAL INTERACTION LOGIC
 * Navigation, Storage ROI Calculator, FAQ Accordion & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky / Scrolled Header Effect & Mobile Drawer ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileNavPanel = document.getElementById('mobileNavPanel');
  if (mobileToggleBtn && mobileNavPanel) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNavPanel.classList.toggle('open');
    });

    // Close when clicking any mobile nav link
    const mobileLinks = mobileNavPanel.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavPanel.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNavPanel.contains(e.target) && e.target !== mobileToggleBtn) {
        mobileNavPanel.classList.remove('open');
      }
    });
  }


  // --- 2. Storage Recovery ROI Calculator ---
  const trackCountSlider = document.getElementById('trackCountSlider');
  const trackCountVal = document.getElementById('trackCountVal');
  const formatSelect = document.getElementById('formatSelect');
  const calcResultGb = document.getElementById('calcResultGb');
  const calcResultMoney = document.getElementById('calcResultMoney');
  const calcResultTime = document.getElementById('calcResultTime');

  function updateCalculator() {
    if (!trackCountSlider) return;

    const count = parseInt(trackCountSlider.value, 10);
    const format = formatSelect ? formatSelect.value : 'mixed';

    trackCountVal.textContent = count.toLocaleString('es-ES') + ' canciones';

    // Average file sizes in MB
    let avgMbPerSong = 22; // default mixed
    if (format === 'flac') avgMbPerSong = 38;
    if (format === 'mp3') avgMbPerSong = 9;

    // Typical duplicate rate in large audio libraries: ~18%
    const duplicateRate = 0.18;
    const duplicatesCount = Math.round(count * duplicateRate);
    const recoveredMb = duplicatesCount * avgMbPerSong;
    const recoveredGb = Math.round(recoveredMb / 1024);

    // Cost saved: average high-speed SSD storage + cloud backup ($0.14 per GB/year)
    const dollarsSaved = Math.max(12, Math.round(recoveredGb * 0.14));

    // Scan time with AudioClean bounded LSH streaming engine: ~350 files per second
    const scanSeconds = Math.max(5, Math.round(count / 320));
    let timeStr = `${scanSeconds} seg`;
    if (scanSeconds >= 60) {
      const min = Math.floor(scanSeconds / 60);
      const sec = scanSeconds % 60;
      timeStr = `${min} min ${sec > 0 ? sec + 's' : ''}`;
    }

    calcResultGb.textContent = `~${recoveredGb} GB`;
    calcResultMoney.textContent = `~$${dollarsSaved} USD`;
    calcResultTime.textContent = timeStr;
  }

  if (trackCountSlider) {
    trackCountSlider.addEventListener('input', updateCalculator);
    if (formatSelect) {
      formatSelect.addEventListener('change', updateCalculator);
    }
    updateCalculator();
  }

  // --- 3. Commercial FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstAns = faqItems[0].querySelector('.faq-answer');
    if (firstAns) firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
  }

  // --- 4. Modals (Demo Download & Purchase Checkout) ---
  const demoModal = document.getElementById('demoModal');
  const buyModal = document.getElementById('buyModal');
  const demoBtns = document.querySelectorAll('.trigger-demo-modal');
  const buyBtns = document.querySelectorAll('.trigger-buy-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (modal === demoModal && window.AudioCleanVault) {
      window.AudioCleanVault.reset();
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (modal === demoModal && window.AudioCleanVault) {
      window.AudioCleanVault.reset();
    }
  }

  demoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(demoModal);
    });
  });

  buyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Pro Lifetime';
      const planNameElem = document.getElementById('checkoutPlanName');
      const planPriceElem = document.getElementById('checkoutPlanPrice');
      if (planNameElem && planPriceElem) {
        if (plan === 'Personal') {
          planNameElem.textContent = 'AudioClean Personal License (1 PC)';
          planPriceElem.textContent = '$24.99 USD';
        } else {
          planNameElem.textContent = 'AudioClean Pro Studio Lifetime (3 PCs)';
          planPriceElem.textContent = '$49.99 USD';
        }
      }
      openModal(buyModal);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(demoModal);
      closeModal(buyModal);
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === demoModal) closeModal(demoModal);
    if (e.target === buyModal) closeModal(buyModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(demoModal);
      closeModal(buyModal);
    }
  });
});
