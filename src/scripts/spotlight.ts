// Brillo que sigue al mouse dentro de las tarjetas [data-spotlight] (ver Card.astro).

document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
  card.addEventListener(
    'pointermove',
    (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--y', `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
});
