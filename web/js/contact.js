/**
 * Copyright 2026 Georgi Emilov Isaev
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
document.addEventListener('DOMContentLoaded', () => {
  initSchoolContactGate();

  const form = document.querySelector('.contact-form');
  if (!form) return;
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

function initSchoolContactGate() {
  const config = window.CONTACT_AUTH_CONFIG || {};
  const clientId = config.googleClientId || '';
  const allowedDomain = (config.allowedDomain || 'nfsg-sofia.org').toLowerCase();
  const isClientConfigured = clientId && !clientId.includes('REPLACE_WITH_GOOGLE_CLIENT_ID');
  const storageKey = `schoolContactAuth:${allowedDomain}`;

  const status = document.getElementById('schoolAuthStatus');
  const signInButton = document.getElementById('googleSignInButton');
  const signOutButton = document.getElementById('schoolSignOut');
  const phonePlaceholder = document.getElementById('privatePhonePlaceholder');
  const addressPlaceholder = document.getElementById('privateAddressPlaceholder');
  const phoneValue = document.getElementById('privatePhoneValue');
  const addressValue = document.getElementById('privateAddressValue');

  if (!status || !signInButton || !phonePlaceholder || !addressPlaceholder || !phoneValue || !addressValue) {
    return;
  }

  const privateContact = {
    phone: {
      label: '+359 878 720 963',
      href: 'tel:+359878720963'
    },
    address: 'ул. проф. Фритьоф Нансен 3, София'
  };

  const setLockedState = (message, isError = false) => {
    phonePlaceholder.hidden = false;
    addressPlaceholder.hidden = false;
    phoneValue.hidden = true;
    addressValue.hidden = true;
    phoneValue.replaceChildren();
    addressValue.textContent = '';
    status.textContent = message;
    status.classList.toggle('auth-error', isError);
    signInButton.hidden = false;
    if (signOutButton) signOutButton.hidden = true;
    document.querySelectorAll('.protected-contact').forEach(item => item.classList.remove('is-unlocked'));
    if (window.lucide) lucide.createIcons();
  };

  const setUnlockedState = (profile) => {
    const phoneLink = document.createElement('a');
    phoneLink.href = privateContact.phone.href;
    phoneLink.textContent = privateContact.phone.label;

    phoneValue.replaceChildren(phoneLink);
    addressValue.textContent = privateContact.address;

    phonePlaceholder.hidden = true;
    addressPlaceholder.hidden = true;
    phoneValue.hidden = false;
    addressValue.hidden = false;
    status.textContent = `Влязохте като ${profile.email}. Телефонът и адресът вече са видими.`;
    status.classList.remove('auth-error');
    signInButton.hidden = true;
    if (signOutButton) signOutButton.hidden = false;
    document.querySelectorAll('.protected-contact').forEach(item => item.classList.add('is-unlocked'));
    if (window.lucide) lucide.createIcons();
  };

  const saveProfile = (profile) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch (err) {
      // Browsers can block localStorage in private contexts; the current render still works.
    }
  };

  const clearProfile = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      // Ignore unavailable storage.
    }
  };

  const getStoredProfile = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const profile = JSON.parse(raw);
      const expiresAt = Number(profile.expiresAt || 0);
      if (!profile.email || !expiresAt || Date.now() > expiresAt) {
        clearProfile();
        return null;
      }
      return profile;
    } catch (err) {
      clearProfile();
      return null;
    }
  };

  const parseJwtPayload = (credential) => {
    const payload = credential.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '='));
    return JSON.parse(decoded);
  };

  const profileFromCredential = (credential) => {
    const payload = parseJwtPayload(credential);
    if (!payload || !payload.email) return null;

    return {
      email: String(payload.email).toLowerCase(),
      emailVerified: payload.email_verified === true || payload.email_verified === 'true',
      hostedDomain: String(payload.hd || '').toLowerCase(),
      expiresAt: Number(payload.exp || 0) * 1000
    };
  };

  const isAllowedProfile = (profile) => {
    if (!profile || !profile.emailVerified) return false;
    const emailDomain = profile.email.split('@').pop();
    return emailDomain === allowedDomain && (!profile.hostedDomain || profile.hostedDomain === allowedDomain);
  };

  const handleCredential = (response) => {
    try {
      const profile = profileFromCredential(response.credential || '');
      if (!isAllowedProfile(profile)) {
        clearProfile();
        setLockedState(`Достъпът е само за потвърдени Google профили с имейл @${allowedDomain}.`, true);
        return;
      }

      saveProfile(profile);
      setUnlockedState(profile);
    } catch (err) {
      clearProfile();
      setLockedState('Неуспешно удостоверяване. Опитайте отново с училищен Google профил.', true);
    }
  };

  const renderGoogleButton = () => {
    if (!window.google?.accounts?.id) return false;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      hd: allowedDomain,
      ux_mode: 'popup'
    });

    google.accounts.id.renderButton(signInButton, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: Math.min(signInButton.offsetWidth || 320, 360)
    });

    return true;
  };

  const storedProfile = getStoredProfile();
  if (storedProfile && isAllowedProfile(storedProfile)) {
    setUnlockedState(storedProfile);
  } else {
    setLockedState(
      `Влезте с Google профил от домейна ${allowedDomain}, за да видите телефон и адрес. Ако нямате такъв профил, използвайте контактната форма.`
    );
  }

  if (!isClientConfigured) {
    signInButton.classList.add('is-disabled');
    signInButton.textContent = 'Google Sign-In не е конфигуриран';
    setLockedState(
      'Google Sign-In очаква OAuth Client ID. След конфигуриране ще допуска само профили @nfsg-sofia.org.',
      true
    );
    return;
  }

  const tryRenderUntilReady = (attempt = 0) => {
    if (renderGoogleButton()) return;

    if (attempt < 40) {
      window.setTimeout(() => tryRenderUntilReady(attempt + 1), 125);
      return;
    }

    setLockedState('Google Sign-In не се зареди. Можете да използвате контактната форма.', true);
  };

  tryRenderUntilReady();

  if (signOutButton) {
    signOutButton.addEventListener('click', () => {
      clearProfile();
      if (window.google?.accounts?.id) {
        google.accounts.id.disableAutoSelect();
      }
      setLockedState(
        `Излязохте от училищния достъп. Влезте с профил @${allowedDomain}, за да видите телефон и адрес.`
      );
    });
  }
}
