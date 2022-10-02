import './global.css';
import App from './components/app';
import { IStoredFilterOptions } from './types';

document.addEventListener('DOMContentLoaded', () => {
    const sort = (document.querySelector('.select__placeholder') as HTMLElement).dataset.placeholder;
    const searchInput = document.querySelector('.header__input');

    const initialFilterValue: Array<IStoredFilterOptions> = sessionStorage['filter']
        ? JSON.parse(sessionStorage.filter)
        : [{ sortOption: sort }];

    const app = new App(initialFilterValue, searchInput as HTMLInputElement);
    app.start();
});
