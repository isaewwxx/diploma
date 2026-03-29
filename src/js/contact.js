/* ============================================
   contact.js — Formspree AJAX Submit + Toast
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'form-toast';
  document.body.appendChild(toast);

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Изпращане...';
    submitBtn.disabled = true;
    if (window.lucide) lucide.createIcons();

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        showToast('Съобщението е изпратено успешно!');
        form.reset();
      } else {
        const data = await res.json();
        const errorMsg = data.errors
          ? data.errors.map(e => e.message).join(', ')
          : 'Възникна грешка. Моля, опитайте отново.';
        showToast(errorMsg, true);
      }
    } catch (err) {
      showToast('Мрежова грешка. Проверете връзката си.', true);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      if (window.lucide) lucide.createIcons();
    }
  });
});
