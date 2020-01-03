export interface IPool<T> {
  create: () => T;
  obtain: () => T;
  free: (obj: T) => void;
  reset: () => void;
}

export class Pool<T> implements IPool<T> {
  private readonly objects: T[] = [];
  private readonly supplier: () => T;
  private readonly resetFn?: (obj: T) => void;

  constructor(supplier: () => T, resetFn?: (obj: T) => void) {
    this.supplier = supplier;
    this.resetFn = resetFn;
  }

  create(): T {
    return this.supplier();
  }

  obtain(): T {
    if (this.objects.length === 0) {
      return this.create();
    }
    return this.objects.shift()!;
  }

  /**
   * Frees the given object and adds it to the pool.
   * This method does not check if obj is already present in the pool.
   * Do not free the same object twice!
   */
  free(obj: T) {
    if (obj === null) {
      throw new Error('Do not free null objects');
    }
    if (this.resetFn) {
      this.resetFn(obj);
    }
    this.objects.push(obj);
  }

  reset() {
    if (this.resetFn !== undefined) {
      this.objects.forEach(this.resetFn);
    }
    this.objects.length = 0;
  }
}
