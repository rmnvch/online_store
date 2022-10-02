import products from '../../data/gear.json';
import { IStoredFilterOptions, IProductCard, TCallback, SortTypes } from '../../types';

export default class Loader {
    productList: IProductCard[];
    currentList: IProductCard[];
    constructor() {
        this.productList = [];
        this.currentList = [];
    }
    protected getData(filterReq: IStoredFilterOptions[], callback: TCallback) {
        if (!this.productList.length) {
            this.load();
        }
        const filterType = Object.keys(filterReq[0]).filter((val: string) => val !== 'sortOption');
        const sortType = filterReq[0].sortOption;
        if (!filterType.length) {
            const sorted: IProductCard[] = this.sortData(this.productList, sortType as SortTypes);
            callback(sorted);
            this.currentList = [];
        } else {
            this.currentList = this.productList;
            let temp: IProductCard[] = [];
            filterType.forEach((item) => {
                const filterChunk = this.filterData(item, filterReq[0][item as keyof IStoredFilterOptions]);
                temp = [...filterChunk];
            });
            const sorted: IProductCard[] = this.sortData(temp, sortType as SortTypes);
            callback(sorted);
        }
    }

    private load() {
        this.productList = products; //supposed to be a fetch inquiry
    }

    private filterData(prop: string, arr: Array<number> | Array<string> | undefined | string): IProductCard[] {
        const res: IProductCard[] = [];
        if (prop === 'year' || prop === 'price') {
            if (arr) {
                const temp = this.currentList.filter(
                    (item: IProductCard) =>
                        item[prop as keyof IProductCard] > arr[0] && item[prop as keyof IProductCard] < arr[1]
                );
                res.push(...temp);
            }
            this.currentList = [...res];
            return res;
        }
        if (prop === 'search') {
            const temp = this.currentList.filter(
                (item: IProductCard) =>
                    item.name.toLowerCase().includes(arr as string) ||
                    item.year.includes(arr as string) ||
                    item.type.toLowerCase().includes(arr as string)
            );
            res.push(...temp);
            this.currentList = [...res];
            return res;
        }
        if (prop === 'stock') {
            if (arr === 'unique') {
                const temp = this.currentList.filter((item: IProductCard) => item.availability === 1);
                res.push(...temp);
            }
            if (arr === 'stock') {
                const temp = this.currentList.filter((item: IProductCard) => item.availability > 1);
                res.push(...temp);
            }
            this.currentList = [...res];
            return res;
        } else {
            (arr as Array<string>).forEach((value) => {
                const temp = this.currentList.filter(
                    (item: IProductCard) => item[prop as keyof IProductCard] === value
                );
                res.push(...temp);
            });
            this.currentList = [...res];
            return res;
        }
    }

    private sortData(prodList: IProductCard[], sortOption: SortTypes): IProductCard[] {
        switch (sortOption) {
            case SortTypes['a-z']:
                return prodList.sort(this.sortByFieldDown('name'));
            case SortTypes['z-a']:
                return prodList.sort(this.sortByFieldUp('name'));
            case SortTypes['high-low']:
                return prodList.sort(this.sortByFieldUp('price'));
            case SortTypes['low-high']:
                return prodList.sort(this.sortByFieldDown('price'));
            case SortTypes['new-old']:
                return prodList.sort(this.sortByFieldUp('year'));
            case SortTypes['old-new']:
                return prodList.sort(this.sortByFieldDown('year'));
            default:
                return prodList;
        }
    }

    private sortByFieldUp(fld: string) {
        return (a: IProductCard, b: IProductCard) =>
            a[fld as keyof IProductCard] > b[fld as keyof IProductCard] ? -1 : 1;
    }

    private sortByFieldDown(fld: string) {
        return (a: IProductCard, b: IProductCard) =>
            a[fld as keyof IProductCard] < b[fld as keyof IProductCard] ? -1 : 1;
    }

    protected getMaxMinValue(field: SortTypes, key: string) {
        const list = this.currentList.length ? this.currentList : this.productList;
        const res = this.sortData(list, field);
        return [res[0][key as keyof IProductCard], res[res.length - 1][key as keyof IProductCard]];
    }
}
