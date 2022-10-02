export default function handleSelectClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!(target.parentElement as HTMLElement).classList.contains('select') && !document.querySelector('.is-open'))
        return;
    if (target.classList.contains('select__item')) {
        selectOption(target);
    }
    (document.querySelector('.select__list') as HTMLElement).classList.toggle('is-open');
}

function selectOption(target: HTMLElement): void {
    const placeholder = document.querySelector('.select__placeholder') as HTMLElement;
    placeholder.textContent = target.textContent;
    placeholder.dataset.placeholder = target.dataset.sort;
}
