import {
  compose,
  bindLast,
  Fn,
  WithComposer,
  define,
  IComposer,
} from '../src/composer';

describe('compose', () => {
  const trim = (v: any) => String(v).trim();
  const upper = (v: any) => String(v).toUpperCase();

  test('can compose', () => {
    const f = compose(trim, upper);
  });

  test('can apply', () => {
    const f = compose(trim, upper);
    expect(f('  foo')).toBe('FOO');
  });
});

describe('FilterBuilder', () => {
  interface IFunctions {
    trim(): IFunctions;
    upper(): IFunctions;
  }

  type Factory = () => WithComposer<IFunctions> & IComposer;

  const f: Factory = define<IFunctions>({
    trim: val => String(val).trim(),
    upper: val => String(val).toUpperCase(),
  });

  test('can create empty', () => {
    const b = f();
  });

  test('fn() called on empty returns identity', () => {
    expect(f().fn('foo')).toBe('foo');
  });

  test('single fn', () => {
    expect(f().trim().fn('  foo  ')).toBe('foo');
    expect(f().upper().fn('foo')).toBe('FOO');
  });

  test('multi fn', () => {
    expect(f().trim().upper().fn('  foo  ')).toBe('FOO');
  })


  test('can create two builders', () => {
    interface IFirst {
      trim(): IFirst;
    }

    interface ISecond {
      trim(): ISecond;
    }

    const v1 = define<IFirst>({
      trim: v => v.trim()
    });

    const v2 = define<ISecond>({
      trim: v => v.toUpperCase()
    });

    expect(v1().trim().fn('  foo  ')).toBe('foo');
    expect(v2().trim().fn('  foo  ')).toBe('  FOO  ');
  });
});
