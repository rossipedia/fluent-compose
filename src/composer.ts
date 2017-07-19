export type Fn = (value: any, ...args: any[]) => any;

export function bindLast(fn: Fn, ...args: any[]): Fn {
  return args.length === 0 ? fn : (value: any) => fn(value, ...args);
}

export function compose(f1: Fn, f2: Fn) {
  return (value: any) => f1(f2(value));
}

export interface IComposer {
  fn(value: any): any;
}

export type WithComposer<T> = { [k in keyof T]: FilterMethod<T> };

export interface FilterMethod<T> {
  (this: T, ...args: any[]): WithComposer<T> & IComposer;
}

export type FnMap<T> = { [name in keyof T]: Fn };

function identity(value: any) {
  return value;
}

export function define<TFluent>(
  filterMap: FnMap<TFluent>
): () => WithComposer<TFluent> & IComposer {
  class Composer implements IComposer {
    constructor(private f: Fn = identity) {}

    add(fn: Fn, args: any[]) {
      const bound: Fn = bindLast(fn, ...args);
      return new Composer(compose(bound, this.f));
    }

    fn(value: any): any {
      return this.f(value);
    }
  }

  const descMap: PropertyDescriptorMap = {};
  for (let key in filterMap) {
    const fn = filterMap[key];
    descMap[key] = {
      value: function (this: Composer, ...args:any[]) {
        return this.add(fn, args);
      },
    };
  }
  Object.defineProperties(Composer.prototype, descMap);

  return () => new Composer() as any; // I know what I'm doing here
}
