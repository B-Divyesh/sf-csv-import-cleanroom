import './legal.css';

window.addEventListener('pageshow', () => {
  const heading = document.querySelector<HTMLElement>('main h1');
  if (heading) requestAnimationFrame(() => heading.focus());
});
