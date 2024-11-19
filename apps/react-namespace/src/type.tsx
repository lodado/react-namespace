import { NamespaceStore } from '@lodado/namespace-core'

export type StateKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type StateOf<T> = Pick<T, StateKeys<T>>

export type ActionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]
export type ActionsOf<T> = Pick<T, ActionKeys<T>>

export type StoreOption<State extends Record<string | symbol, any>, StoreType extends NamespaceStore<State>> =
  | {
      localStore?: never
      globalStore: (() => StoreType) | StoreType
    }
  | {
      globalStore?: never
      localStore: () => StoreType
    }

export type StoreMethodKeys<StoreType> = {
  [K in keyof StoreType]: StoreType[K] extends (...args: any[]) => any ? K : never
}[keyof StoreType]

export type SuperMethodKeys<State extends Record<string | symbol, any>> = {
  [K in keyof NamespaceStore<State>]: NamespaceStore<State>[K] extends (...args: any[]) => any ? K : never
}[keyof NamespaceStore<State>]

export type SubclassMethodKeys<StoreType, State extends Record<string | symbol, any>> = Exclude<
  StoreMethodKeys<StoreType>,
  SuperMethodKeys<State>
>

export type StoreActions<StoreType, State extends Record<string | symbol, any>> = { reset: () => void } & Pick<
  StoreType,
  SubclassMethodKeys<StoreType, State>
>
