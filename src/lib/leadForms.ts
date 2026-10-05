/** Gemeinsamer, rein browserseitiger Versand für die statische Astro-Website. */
const ENDPOINT = 'https://api.web3forms.com/submit';

type ProviderResponse = { success?: boolean; message?: string };

export async function postLead(formData: FormData): Promise<void> {
  const key = formData.get('access_key');
  if (typeof key !== 'string' || !key || key.includes('YOUR_')) {
    throw new Error('Das Anfrageformular ist noch nicht konfiguriert.');
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });
  let result: ProviderResponse;
  try {
    result = await response.json() as ProviderResponse;
  } catch {
    throw new Error('Die Antwort des Formularanbieters konnte nicht gelesen werden.');
  }
  if (!response.ok || result.success !== true) {
    throw new Error(result.message || 'Die Anfrage wurde vom Formularanbieter nicht angenommen.');
  }
}

export function bindLeadForms(): void {
  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-lead-form]')) {
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!button) continue;

    const feedback = document.createElement('p');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.className = 'hidden rounded-lg p-3 text-sm font-medium';
    button.insertAdjacentElement('afterend', feedback);

    const showFeedback = (success: boolean, text: string) => {
      feedback.textContent = text;
      feedback.className = success
        ? 'rounded-lg p-3 text-sm font-medium bg-green-100 text-green-950'
        : 'rounded-lg p-3 text-sm font-medium bg-red-100 text-red-950';
      form.dataset.submitState = success ? 'success' : 'error';
    };

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled || !form.reportValidity()) return;

      const data = new FormData(form);
      data.delete('redirect'); // AJAX bleibt nach dem Absenden auf der bisherigen Seite.
      const attachment = data.get('attachment');
      if (attachment instanceof File && attachment.size > 5 * 1024 * 1024) {
        showFeedback(false, 'Der Anhang darf höchstens 5 MB groß sein.');
        return;
      }
      if (attachment instanceof File && attachment.size === 0) data.delete('attachment');

      button.disabled = true;
      form.dataset.submitState = 'sending';
      feedback.className = 'hidden';
      try {
        await postLead(data);
        form.reset();
        showFeedback(true, 'Vielen Dank. Ihre Anfrage wurde übermittelt. Wir melden uns bei Ihnen.');
      } catch (error) {
        console.error('Anfrage fehlgeschlagen:', error);
        showFeedback(false, 'Ihre Anfrage konnte nicht versendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 341 98 99 03 91.');
      } finally {
        button.disabled = false;
      }
    });
    form.dataset.leadReady = 'true';
  }
}
