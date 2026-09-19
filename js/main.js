/**
 * AUDIOCLEAN PRO — MAIN COMMERCIAL INTERACTION LOGIC
 * Navigation, FAQ Accordion & Modals
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

  // --- 2. Commercial FAQ Accordion ---
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

  // --- 3. Modals (Demo Download & Purchase Checkout) ---
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
