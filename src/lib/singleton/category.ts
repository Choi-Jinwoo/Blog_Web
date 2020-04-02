export default class CategorySingleton {
  private static _category: CategorySingleton;

  private _idx!: number;

  public static get category(): CategorySingleton {
    if (!CategorySingleton._category) {
      CategorySingleton._category = new CategorySingleton();
    }

    return CategorySingleton._category;
  }

  public get idx(): number {
    return this._idx;
  }

  public set idx(idx: number) {
    this._idx = idx;
  }
}
