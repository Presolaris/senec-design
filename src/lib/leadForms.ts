type ProviderResponse = {
  success?: boolean;
  message?: string;
  messageId?: string;
  verificationRequired?: boolean;
};

const MIN_COMPLETION_MS = 2_500;

export function addLeadProtectionFields(form: HTMLFormElement): void {
  if (!form.querySelector('input[name="form_started_at"]')) {
    const startedAt = document.createElement('input');
    startedAt.type = 'hidden';
    startedAt.name = 'form_started_at';
    startedAt.value = String(Date.now());
    form.appendChild(startedAt);
  }
  if (!form.querySelector('input[name="website"]')) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
    wrapper.innerHTML = '<label for="website">Dieses Feld bitte frei lassen</label><input type="text" id="website" name="website" tabindex="-1" autocomplete="off">';
    form.appendChild(wrapper);
  }
}

export function setLeadFormStartedAt(form: HTMLFormElement): void {
  const input = form.querySelector<HTMLInputElement>('input[name="form_started_at"]');
  if (input) input.value = String(Date.now());
}

export async function postLead(formData: FormData): Promise<ProviderResponse> {
  const startedAt = Number(formData.get('form_started_at'));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_COMPLETION_MS) {
    throw new Error('Bitte nehmen Sie sich einen Moment Zeit und versuchen Sie es erneut.');
  }
  // Keine browserseitigen Provider-Keys oder Fallbacks: Alle Leads werden serverseitig geprüft.
  formData.delete('access_key');
  formData.delete('redirect');
  const response = await fetch('/api/lead/', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });
  let result: ProviderResponse;
  try {
    result = await response.json() as ProviderResponse;
  } catch {
    throw new Error('Die Antwort des Formularservers konnte nicht gelesen werden.');
  }
  if (!response.ok || result.success !== true || result.verificationRequired !== true || !result.messageId) {
    throw new Error(result.message || 'Die Anfrage konnte nicht zur Bestätigung vorbereitet werden.');
  }
  return result;
}

export function bindLeadForms(): void {
  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-lead-form]')) {
    addLeadProtectionFields(form);
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
      const attachment = data.get('attachment');
      if (attachment instanceof File && attachment.size > 0) {
        showFeedback(false, 'Bitte senden Sie die Anfrage zunächst ohne Anhang. Nach der E-Mail-Bestätigung können Sie uns die Datei als Antwort auf die Bestätigungs-E-Mail senden.');
        return;
      }
      button.disabled = true;
      form.dataset.submitState = 'sending';
      feedback.className = 'hidden';
      try {
        await postLead(data);
        form.reset();
        setLeadFormStartedAt(form);
        showFeedback(true, 'Fast geschafft: Bitte bestätigen Sie jetzt den Link, den wir an Ihre E-Mail-Adresse gesendet haben. Erst danach wird Ihre Anfrage an unser Beratungsteam weitergegeben.');
      } catch (error) {
        console.error('Anfrage fehlgeschlagen:', error);
        const message = error instanceof Error ? error.message : '';
        showFeedback(false, message || 'Ihre Anfrage konnte nicht versendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 341 98 99 03 91.');
      } finally {
        button.disabled = false;
      }
    });
    form.dataset.leadReady = 'true';
  }
}
