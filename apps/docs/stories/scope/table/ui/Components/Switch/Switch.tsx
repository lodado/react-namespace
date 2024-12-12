import React from 'react'

type CaseByType<T extends string | number | symbol | boolean> = T extends boolean
  ? { true: React.ReactNode; false: React.ReactNode }
  : T extends string | number | symbol
  ? Record<T, React.ReactNode>
  : never

export interface SwitchCaseProps<T extends string | number | symbol | boolean> {
  value: T
  caseBy: CaseByType<T>
  defaultComponent?: React.ReactNode
}

const Switch = <T extends string | number | symbol | boolean>({
  value,
  caseBy,
  defaultComponent = null,
}: SwitchCaseProps<T>) => {
  return <>{(caseBy as any)[value] ?? defaultComponent}</>
}

export default Switch
