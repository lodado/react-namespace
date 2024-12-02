/* eslint-disable no-param-reassign */
/**
 * promise codes from jotai
 * https://github.com/pmndrs/jotai/blob/main/src/react/useAtomValue.ts
 */

export const isPromiseLike = (x: unknown): x is PromiseLike<unknown> => typeof (x as any)?.then === 'function'

export const attachPromiseMeta = <T>(
  promise: PromiseLike<T> & {
    status?: 'pending' | 'fulfilled' | 'rejected'
    value?: T
    reason?: unknown
  },
) => {
  promise.status = 'pending'
  promise.then(
    (v) => {
      promise.status = 'fulfilled'
      promise.value = v
    },
    (e) => {
      promise.status = 'rejected'
      promise.reason = e
    },
  )
}

export const use = <T>(
  promise: PromiseLike<T> & {
    status?: 'pending' | 'fulfilled' | 'rejected'
    value?: T
    reason?: unknown
  },
): T => {
  if (promise.status === 'pending') {
    throw promise
  } else if (promise.status === 'fulfilled') {
    return promise.value as T
  } else if (promise.status === 'rejected') {
    throw promise.reason
  } else {
    attachPromiseMeta(promise)
    throw promise
  }
}

export const continuablePromiseMap = new WeakMap<PromiseLike<unknown>, Promise<unknown>>()

export const createContinuablePromise = <T>(promise: PromiseLike<T>) => {
  let continuablePromise = continuablePromiseMap.get(promise)
  if (!continuablePromise) {
    continuablePromise = new Promise<T>((resolve, reject) => {
      let curr = promise
      const onFulfilled = (me: PromiseLike<T>) => (v: T) => {
        if (curr === me) {
          resolve(v)
        }
      }
      const onRejected = (me: PromiseLike<T>) => (e: unknown) => {
        if (curr === me) {
          reject(e)
        }
      }
      const registerCancelHandler = (p: PromiseLike<T>) => {
        if ('onCancel' in p && typeof p.onCancel === 'function') {
          p.onCancel((nextValue: PromiseLike<T> | T) => {
            if (isPromiseLike(nextValue)) {
              continuablePromiseMap.set(nextValue, continuablePromise!)
              curr = nextValue
              nextValue.then(onFulfilled(nextValue), onRejected(nextValue))
              registerCancelHandler(nextValue)
            } else {
              resolve(nextValue)
            }
          })
        }
      }
      promise.then(onFulfilled(promise), onRejected(promise))
      registerCancelHandler(promise)
    })
    continuablePromiseMap.set(promise, continuablePromise)
  }
  return continuablePromise
}
