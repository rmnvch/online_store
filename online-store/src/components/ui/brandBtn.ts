export default function handlerBrandBtnClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'BUTTON') return;
    target.classList.toggle('brand-active');
}
