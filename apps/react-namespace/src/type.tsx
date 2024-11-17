export type StateKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type StateOf<T> = Pick<T, StateKeys<T>>;

export type ActionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
export type ActionsOf<T> = Pick<T, ActionKeys<T>>;
