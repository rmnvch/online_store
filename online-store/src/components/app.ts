import { IProductCard } from '../types';
import Controller from './controller/controller';
import AppView from './view/appView';
import { IStoredFilterOptions } from '../types';

export default class App {
    controller;
    view;
    search;
    constructor(initialFilters: IStoredFilterOptions[], searchInput: HTMLInputElement) {
        this.controller = new Controller(initialFilters, (data: IProductCard[]) => this.view.drawGallery(data));
        this.view = new AppView();
        this.search = searchInput;
    }
    start() {
        this.controller.getProducts(
            this.controller.filterState,
            (data: IProductCard[]) => this.view.drawGallery(data),
            undefined,
            this.search
        );
    }
}
