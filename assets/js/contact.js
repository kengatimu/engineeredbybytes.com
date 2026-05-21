/* =============================================================
   EBB SYSTEMS — CONTACT FORM
   AJAX submission to Formspree so the user stays on our page
   instead of being redirected to Formspree's branded thank-you.
   ============================================================= */

(function () {
  'use strict';

  const form    = document.getElementById('contactForm');
  const status  = document.getElementById('contactStatus');
  const submit  = document.getElementById('contactSubmit');

  if (!form || !status || !submit) return;

  const submitLabel = submit.querySelector('.btn__label');
  const originalLabel = submitLabel ? submitLabel.textContent : 'Send Message';

  function setStatus(kind, message) {
    status.className = 'form-status form-status--' + kind;
    status.textContent = message;
  }

  function setSubmitting(isSubmitting) {
    submit.disabled = isSubmitting;
    if (submitLabel) {
      submitLabel.textContent = isSubmitting ? 'Sending…' : originalLabel;
    }
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Native HTML5 validation first — short-circuit if invalid
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitting(true);
    setStatus('pending', 'Sending your message…');

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setStatus('success',
          'Thanks — your message is on its way. We’ll respond within one business day.');
        form.reset();
      } else {
        // Formspree returns a JSON error payload for known issues
        let detail = '';
        try {
          const payload = await response.json();
          if (payload && payload.errors && payload.errors.length) {
            detail = ' (' + payload.errors.map(e => e.message).join(', ') + ')';
          }
        } catch (_) { /* response wasn't JSON; ignore */ }

        setStatus('error',
          'Something went wrong sending your message' + detail +
          '. Please email info@engineeredbybytes.com directly.');
      }
    } catch (err) {
      // Network failure, CORS issue, offline, etc.
      setStatus('error',
        'Couldn’t reach the server. Check your connection or email ' +
        'info@engineeredbybytes.com directly.');
    } finally {
      setSubmitting(false);
    }
  });

})();
