// Botones para copiar el correo. Cualquier elemento con data-copy-email="correo" copia ese texto.
// Hijos opcionales: .copy-idle (ícono normal), .copy-done (ícono de éxito) y .copy-label (texto que cambia a "¡Copiado!").

const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Respaldo para navegadores o contextos sin Clipboard API
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand('copy');
    input.remove();
    return ok;
  }
};

document.querySelectorAll<HTMLElement>('[data-copy-email]').forEach((button) => {
  const label = button.querySelector<HTMLElement>('.copy-label');
  const idle = button.querySelector('.copy-idle');
  const done = button.querySelector('.copy-done');
  const originalText = label?.textContent ?? '';
  let timer: number | undefined;

  const setCopied = (copied: boolean): void => {
    idle?.classList.toggle('hidden', copied);
    done?.classList.toggle('hidden', !copied);
    if (label) label.textContent = copied ? '¡Copiado!' : originalText;
  };

  button.addEventListener('click', async () => {
    const ok = await copyText(button.dataset.copyEmail ?? '');
    if (!ok) return;

    setCopied(true);
    window.clearTimeout(timer);
    timer = window.setTimeout(() => setCopied(false), 2000);
  });
});
