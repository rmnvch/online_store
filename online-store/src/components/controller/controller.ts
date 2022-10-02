import * as noUiSlider from 'nouislider';
import * as wNumb from 'wnumb';
import 'nouislider/dist/nouislider.css';
import Loader from '../module/module';
import { TCallback, IStoredFilterOptions, SortTypes, ICart } from '../../types';
import handlerBrandBtnClick from '../ui/brandBtn';
import '../ui/slider.css';
import '../ui/select.css';

export default class Controller extends Loader {
    filterState;
    callback;
    sliderPrice;
    sliderYear;
    cart: ICart[];
    constructor(initialValue: IStoredFilterOptions[], callback: TCallback) {
        super();
        this.cart = sessionStorage['cart'] ? JSON.parse(sessionStorage['cart']) : [];
        this.filterState = initialValue;
        this.callback = callback;
        (document.querySelector('.filter__brand-list') as HTMLElement).addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            if (!target.dataset.brand) return;
            handlerBrandBtnClick(event);
            if (!this.filterState[0].brand) {
                this.filterState[0].brand = [];
                this.filterState[0].brand.push(target.dataset.brand);
            } else if (this.filterState[0].brand.includes(target.dataset.brand)) {
                const tempArr = this.filterState[0].brand.filter((item) => item !== target.dataset.brand);
                this.filterState[0].brand = tempArr;
                if (!this.filterState[0].brand.length) delete this.filterState[0].brand;
            } else {
                this.filterState[0].brand.push(target.dataset.brand);
            }
            this.getProducts(this.filterState, callback);
            this.setSliderProps();
        });
        (document.querySelector('.filter__guitar-type') as HTMLElement).addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            if (!target.dataset.type) return;
            if (!this.filterState[0].type) {
                this.filterState[0].type = [];
                this.filterState[0].type.push(target.dataset.type);
            } else if (this.filterState[0].type.includes(target.dataset.type)) {
                const tempArr = this.filterState[0].type.filter((item) => item !== target.dataset.type);
                this.filterState[0].type = tempArr;
                if (!this.filterState[0].type.length) delete this.filterState[0].type;
            } else {
                this.filterState[0].type.push(target.dataset.type);
            }
            this.getProducts(this.filterState, callback);
            this.setSliderProps();
        });
        document.querySelector('.select__placeholder')?.addEventListener('click', () => {
            (document.querySelector('.select__list') as HTMLElement).classList.toggle('is-open');
        });
        document.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            if (!document.querySelector('.is-open') || target.classList.contains('select__placeholder')) return;
            document.querySelector('.select__list')?.classList.toggle('is-open', !'is-open');
        });
        document.querySelectorAll('.select__item')?.forEach((option) => {
            option.addEventListener('click', (event: Event) => {
                const target = event.target as HTMLElement;
                const placeholder = document.querySelector('.select__placeholder') as HTMLElement;
                placeholder.textContent = target.textContent;
                placeholder.dataset.placeholder = target.dataset.sort;
                this.filterState[0].sortOption = (document.querySelector('.select__placeholder') as HTMLElement).dataset
                    .placeholder as string;
                this.getProducts(this.filterState, callback);
            });
        });
        document.querySelector('.filter__reset')?.addEventListener('click', () => {
            this.resetFilters();
            this.setSliderProps();
            this.getProducts(this.filterState, callback, true);
        });
        document.querySelector('.filter__default-btn')?.addEventListener('click', () => {
            this.resetStorage();
            this.getProducts(this.filterState, callback);
            this.setSliderProps();
        });
        document.querySelector('.header__input')?.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            if (!this.filterState[0].search) {
                this.filterState[0].search = target.value.toLowerCase();
            } else {
                if (!target.value) {
                    delete this.filterState[0].search;
                } else {
                    this.filterState[0].search = target.value.toLowerCase();
                }
            }
            this.getProducts(this.filterState, callback);
        });
        document.querySelector('.gallery__list')?.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            if (!target.classList.contains('card__add')) return;
            const card = target.closest('li') as HTMLElement;
            card.classList.toggle('in-cart');
            if (card.dataset.id) this.handleCart(+card.dataset.id);
        });
        document.querySelector('.header__search-close')?.addEventListener('click', () => {
            (document.querySelector('.header__input') as HTMLInputElement).value = '';
            delete this.filterState[0].search;
            this.getProducts(this.filterState, callback);
        });
        (document.querySelector('.filter__in-stock') as HTMLElement).addEventListener('click', (event: Event) => {
            const target = event.target as HTMLLabelElement;
            if (!target.classList.contains('in-stock__label')) return;
            switch (target.getAttribute('for')) {
                case 'all':
                    if (this.filterState[0].stock) delete this.filterState[0].stock;
                    break;
                case 'unique':
                    this.filterState[0].stock = 'unique';
                    break;
                case 'stock':
                    this.filterState[0].stock = 'stock';
                    break;
            }
            this.getProducts(this.filterState, callback);
        });

        const wNumbFunc = wNumb.default;

        const sliderYear: noUiSlider.target = document.querySelector('#slider-year') as HTMLElement;
        const sliderPrice: noUiSlider.target = document.querySelector('#slider-price') as HTMLElement;

        noUiSlider.create(sliderYear, {
            start: [1957, 2019],
            connect: true,
            tooltips: true,
            range: {
                min: 1957,
                max: 2019,
            },
            step: 1,
            format: wNumbFunc({
                decimals: 0,
            }),
        });

        noUiSlider.create(sliderPrice, {
            start: [995, 155000],
            connect: true,
            tooltips: true,
            range: {
                min: 995,
                max: 105000,
            },
            step: 25,
            format: wNumbFunc({
                decimals: 2,
                suffix: ' (GBP £)',
            }),
        });

        this.sliderPrice = sliderPrice;
        this.sliderYear = sliderYear;

        this.sliderPrice.noUiSlider?.on('end', (value) => {
            const min = value[0] as string;
            const max = value[1] as string;
            const resMin = min.match(/\d+/g) || [];
            const resMax = max.match(/\d+/g) || [];
            this.filterState[0].price = [parseInt(resMin[0]), parseInt(resMax[0])];
            this.getProducts(this.filterState, callback);
        });

        this.sliderYear.noUiSlider?.on('end', (value) => {
            const min = value[0] as string;
            const max = value[1] as string;
            const resMin = min.match(/\d+/g) || [];
            const resMax = max.match(/\d+/g) || [];
            this.filterState[0].year = [parseInt(resMin[0]), parseInt(resMax[0])];
            this.getProducts(this.filterState, callback);
        });
    }
    public getProducts(
        props: IStoredFilterOptions[],
        callback: TCallback,
        udpdateStorage?: boolean,
        focusedOn?: HTMLInputElement
    ) {
        if (!udpdateStorage) {
            this.storageUpdate(props);
        }
        super.getData(props, callback);
        this.handleUIElementsState();
        focusedOn?.focus();
    }

    private resetFilters() {
        const activeFilters = Object.keys(this.filterState[0]).filter((item: string) => item !== 'sortOption');
        activeFilters.forEach((filter: string) => {
            delete this.filterState[0][filter as keyof IStoredFilterOptions];
        });
        this.handleUIElementsState();
        this.sliderPrice.noUiSlider?.reset();
        this.sliderYear.noUiSlider?.reset();
    }

    private handleUIElementsState() {
        if (!this.filterState[0].brand && !this.filterState[0].type) {
            document.querySelectorAll('.brand-active').forEach((item) => item.classList.remove('brand-active'));

            document.querySelectorAll('.checkbox-hidden').forEach((item) => {
                if ((item as HTMLInputElement).type === 'checkbox') {
                    (item as HTMLInputElement).checked = false;
                }
            });
        } else {
            this.filterState[0].brand?.forEach((brand: string) => {
                document.querySelectorAll('.filter__brand-btn').forEach((elem) => {
                    if (brand === (elem as HTMLElement).dataset.brand) elem.classList.add('brand-active');
                });
            });
            this.filterState[0].type?.forEach((type: string) => {
                document.querySelectorAll('.checkbox-hidden').forEach((elem) => {
                    if (type === (elem as HTMLInputElement).dataset.type) (elem as HTMLInputElement).checked = true;
                });
            });
        }
        if (this.filterState[0].search) {
            (document.querySelector('.header__input') as HTMLInputElement).value = this.filterState[0].search;
        }
        const placeholder = document.querySelector('.select__placeholder') as HTMLElement;
        switch (this.filterState[0]?.sortOption) {
            case SortTypes['a-z']:
                placeholder.dataset.placeholder = SortTypes['a-z'];
                placeholder.textContent = 'Brand, A ... Z';
                break;
            case SortTypes['z-a']:
                placeholder.dataset.placeholder = SortTypes['z-a'];
                placeholder.textContent = 'Brand, Z ... A';
                break;
            case SortTypes['high-low']:
                placeholder.dataset.placeholder = SortTypes['high-low'];
                placeholder.textContent = 'Price, Highest ... Lowest';
                break;
            case SortTypes['low-high']:
                placeholder.dataset.placeholder = SortTypes['low-high'];
                placeholder.textContent = 'Price, Lowest ... Highest';
                break;
            case SortTypes['new-old']:
                placeholder.dataset.placeholder = SortTypes['new-old'];
                placeholder.textContent = 'Year, Newest ... Oldest';
                break;
            case SortTypes['old-new']:
                placeholder.dataset.placeholder = SortTypes['old-new'];
                placeholder.textContent = 'Year, Oldest ... Newest';
                break;
            default:
                placeholder.dataset.placeholder = SortTypes['high-low'];
                placeholder.textContent = 'Price, Highest ... Lowest';
        }
        if (this.cart.length) {
            (document.querySelector('.header__cart') as HTMLElement).classList.add('header__cart--full');
            (document.querySelector('.header__cart-qty') as HTMLElement).textContent = this.cart.length.toString();
            document.querySelectorAll('.card').forEach((card) => {
                this.cart.forEach((prod) => {
                    const cardEl = card as HTMLElement;
                    if (cardEl.dataset.id) if (prod.id === +cardEl.dataset.id) card.classList.add('in-cart');
                });
            });
        }
        if (this.filterState[0].stock) {
            switch (this.filterState[0].stock) {
                case 'unique':
                    (document.getElementById('unique') as HTMLInputElement).checked = true;
                    break;
                case 'stock':
                    (document.getElementById('stock') as HTMLInputElement).checked = true;
                    break;
                default:
                    (document.getElementById('stock') as HTMLInputElement).checked = true;
            }
        }
        this.setSliderProps();
    }

    private storageUpdate(state: IStoredFilterOptions[]) {
        if (sessionStorage['filter']) delete sessionStorage['filter'];
        sessionStorage.setItem('filter', JSON.stringify(state));
    }

    private storageCart(cart: ICart[]) {
        // if (sessionStorage['cart']) delete sessionStorage['cart'];
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    private resetStorage() {
        this.resetFilters();
        delete sessionStorage['filter'];
        if (sessionStorage['cart']) delete sessionStorage['cart'];
    }

    private setSliderProps() {
        if (this.filterState[0].price) {
            console.log('aaa');
            const price = this.filterState[0].price;
            this.sliderPrice.noUiSlider?.set(price as Array<number | string>);
        }

        if (this.filterState[0].year) {
            const year = this.filterState[0].year;
            this.sliderYear.noUiSlider?.set(year as Array<number | string>);
        } else {
            const price = super.getMaxMinValue(SortTypes['low-high'], 'price');
            const year = super.getMaxMinValue(SortTypes['old-new'], 'year');
            this.sliderPrice.noUiSlider?.set(price as string[]);
            this.sliderYear.noUiSlider?.set(year as string[]);
        }
    }

    private handleCart(prodId: number, quantity?: number) {
        console.log(this.cart);
        if (this.cart.length >= 20) {
            alert('Max allowed number of items in cart is 20. PLease check cart or go to checkout');
            return;
        }
        const idMatch = this.cart.filter((item) => item.id !== prodId);
        if (idMatch.length === this.cart.length) {
            this.cart.push({ id: prodId, qty: quantity ? quantity : 1 });
        } else {
            this.cart = [...idMatch];
        }
        if (this.cart.length) {
            document.querySelector('.header__cart')?.classList.add('header__cart--full');
        }
        if (!this.cart.length) {
            document.querySelector('.header__cart')?.classList.remove('header__cart--full');
        }
        (document.querySelector('.header__cart-qty') as HTMLElement).textContent = this.cart.length.toString();
        this.storageCart(this.cart);
    }
}
