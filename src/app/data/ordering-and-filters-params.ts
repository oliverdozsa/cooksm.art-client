import {CookingTime} from "./recipe";

export class OrderingAndFiltersParams {
  orderBy: string | undefined;
  orderBySort: string | undefined;
  minIngs: number | undefined;
  maxIngs: number | undefined;
  times: number[] | undefined;

  private _filterByName: string | undefined;

  set filterByName(value: string) {
    if (value) {
      this._filterByName = value;
    } else {
      this._filterByName = undefined;
    }
  }

  get filterByName(): string | undefined {
    return this._filterByName;
  }

  equals(other: OrderingAndFiltersParams) {
    return this.filterByName === other.filterByName &&
      this.orderBy === other.orderBy &&
      this.orderBySort === other.orderBySort &&
      this.minIngs === other.minIngs &&
      this.maxIngs === other.maxIngs &&
      JSON.stringify(this.times) === JSON.stringify(other.times)
  }

  copy(): OrderingAndFiltersParams {
    const copy = new OrderingAndFiltersParams();
    copy._filterByName = this._filterByName?.slice();
    copy.orderBy = this.orderBy?.slice();
    copy.orderBy = this.orderBySort?.slice();
    copy.minIngs = this.minIngs;
    copy.maxIngs = this.maxIngs;
    copy.times = this.times?.slice()

    return copy;
  }

  setOrderBySortFromStr(value: string | undefined) {
    if (value) {
      const parts = value.split(' ');
      this.orderBy = parts[0];
      this.orderBySort = parts[1];
    } else {
      this.orderBy = undefined;
      this.orderBySort = undefined;
    }
  }

  orderBySortAsStr(): string | undefined {
    if (this.orderBy && this.orderBySort) {
      return `${this.orderBy} ${this.orderBySort}`;
    }

    return undefined;
  }

  addCookingTimeFilter(value: CookingTime) {
    if (this.times === undefined) {
      this.times = [];
    }

    if (this.times.find(t => t === value) != undefined) {
      return;
    }

    this.times = this.times.concat(value);
  }

  removeCookingTimeFilter(value: CookingTime) {
    if (this.times === undefined) {
      return;
    }

    this.times = this.times.filter(t => t != value);
  }
}
