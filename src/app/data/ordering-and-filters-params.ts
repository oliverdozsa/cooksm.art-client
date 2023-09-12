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
}
