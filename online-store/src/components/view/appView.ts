import Gallery from './gallery/gallery';
import { IProductCard } from '../../types';

export default class AppView {
    gallery;

    constructor() {
        this.gallery = new Gallery();
    }

    drawGallery(data: Array<IProductCard>) {
        const val = data.length ? data : [];
        this.gallery.draw(val);
    }
}
