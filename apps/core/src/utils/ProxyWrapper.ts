export type ProxyHandler<T> = {
  get?: (target: T, key: keyof T, receiver: any) => any
  set?: (target: T, key: keyof T, value: any, receiver: any) => boolean
}

/**
 * note :
 * Maybe we should use "proxy-compare" library like valtio?
 * We need to investigate further before implementing it.
 */
export class ProxyWrapper<T extends object> {
  private proxy: T

  constructor(targetObject: T, handler: ProxyHandler<T>) {
    if (typeof Proxy !== 'undefined') {
      this.proxy = new Proxy(targetObject, {
        get: (target, key, receiver) => {
          return handler.get ? handler.get(target, key as keyof T, receiver) : target[key as keyof T]
        },
        set: (target, key, value, receiver) => {
          // eslint-disable-next-line no-return-assign
          return handler.set
            ? handler.set(target, key as keyof T, value, receiver)
            : ((target[key as keyof T] = value), true)
        },
      }) as T
    } else {
      this.proxy = this.createMockProxy(targetObject, handler)
    }
  }

  private createMockProxy(target: T, handler: ProxyHandler<T>): T {
    const wrappedTarget = {} as T

    const descriptors = Object.getOwnPropertyDescriptors(target)

    Object.keys(descriptors).forEach((key) => {
      const typedKey = key as keyof T
      const originalDescriptor = descriptors[typedKey]

      Object.defineProperty(wrappedTarget, key, {
        get: () => {
          return handler.get ? handler.get(target, typedKey, this) : originalDescriptor.value
        },
        set: (newValue) => {
          if (handler.set) {
            handler.set(target, typedKey, newValue, this)
          } else if (originalDescriptor.writable) {
            originalDescriptor.value = newValue
          }
        },
        enumerable: originalDescriptor.enumerable,
        configurable: originalDescriptor.configurable,
      })
    })

    return wrappedTarget
  }
  public getProxy(): T {
    return this.proxy
  }
}
