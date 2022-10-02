import './gallery.css';
import { IProductCard } from '../../../types';

export default class Gallery {
    draw(data: Array<IProductCard>) {
        if (!data.length) {
            const fragment = document.createDocumentFragment();
            const messageEl = document.createElement('h2');
            messageEl.textContent =
                'Sorry... It seems that currently we do not have instruments according to your search parameters. Try to "reset all" and search again';
            fragment.append(messageEl);
            messageEl.classList.add('no-products-message');
            (document.querySelector('.results-display') as HTMLDivElement).textContent = data.length.toString();
            (document.querySelector('.gallery__list') as HTMLDivElement).innerHTML = '';
            (document.querySelector('.gallery__list') as HTMLDivElement).style.display = 'block';
            (document.querySelector('.gallery__list') as HTMLDivElement).appendChild(fragment);
        } else {
            const fragment = document.createDocumentFragment();
            const galleryTemp = document.querySelector('#galleryTemp') as HTMLTemplateElement;
            data.forEach((item) => {
                const productCardClone = galleryTemp.content.cloneNode(true) as HTMLDivElement;
                const cardTitle: string =
                    item.brand !== 'Other'
                        ? item.brand + ' ' + item.model + ' ' + item.year + ', ' + item.color
                        : item.model + ' ' + item.year + ', ' + item.color;
                const priceFormatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'GBP',
                });

                const cardPrice: string = priceFormatter.format(item.price); /* $2,500.00 */
                (productCardClone.querySelector('.card') as HTMLOListElement).setAttribute(
                    'data-id',
                    item.id.toString()
                );
                if (item.availability > 1) {
                    (productCardClone.querySelector(
                        '.card__type--qty'
                    ) as HTMLImageElement).textContent = `in stock: ${item.availability} pcs`;
                    (productCardClone.querySelector('.card__type--qty') as HTMLImageElement).style.backgroundColor =
                        'rgba(48, 87, 103, 0.6)';
                } else {
                    (productCardClone.querySelector('.card__type--qty') as HTMLImageElement).textContent = `unique`;
                }
                (productCardClone.querySelector('.card__img') as HTMLImageElement).src = `./assets/${item.img}`;
                (productCardClone.querySelector('.card__img') as HTMLImageElement).alt = `${item.name}`;
                (productCardClone.querySelector('.card__type') as HTMLImageElement).textContent = item.type;
                (productCardClone.querySelector('.card__name') as HTMLHeadingElement).textContent = cardTitle;
                (productCardClone.querySelector('.card__price') as HTMLSpanElement).innerHTML = cardPrice;
                fragment.append(productCardClone);
            });
            (document.querySelector('.results-display') as HTMLDivElement).textContent = data.length.toString();
            (document.querySelector('.gallery__list') as HTMLDivElement).style.display = 'grid';
            (document.querySelector('.gallery__list') as HTMLDivElement).innerHTML = '';
            (document.querySelector('.gallery__list') as HTMLDivElement).appendChild(fragment);
        }
    }
}
