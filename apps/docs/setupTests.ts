import '@testing-library/jest-dom'

import { setProjectAnnotations } from '@storybook/react'
import jest from 'jest'

// eslint-disable-next-line import/no-extraneous-dependencies
import globalStorybookConfig from './.storybook/preview' // path of your preview.js file

setProjectAnnotations(globalStorybookConfig)

const ESTIMATED_SIZE = 1024

// @ts-ignore
window.Element.prototype.getBoundingClientRect = () => {
  return { height: ESTIMATED_SIZE, width: ESTIMATED_SIZE }
}
