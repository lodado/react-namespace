/* eslint-disable local-rules/no-console-log */
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { exec } = require('child_process')

const validatePackageName = (name) => {
  const regex = /^@react-namespace\/[a-zA-Z0-9-_]+$/
  if (!regex.test(name)) {
    throw new Error(`Invalid package name format. It should be in the format @react-namespace/package's name`)
  }

  const hasUppercase = /[A-Z-]/.test(name.split('/')[1])
  if (hasUppercase) {
    console.warn('Warning: Package name should not contain uppercase letters.')
  }
}

const generatePackageJson = (packageName, sourcePath) => {
  // 무엇인지 인지한 상태에서 바꿀것
  const [namespace, name] = packageName.split('/')

  const packageJson = {
    name: `${namespace}/${name.toLowerCase()}`,
    version: '0.0.0',
    sideEffects: ['./index.scss'],
    license: 'MIT',
    exports: {
      '.': {
        require: sourcePath,
        import: sourcePath,
      },
      './index.scss': './index.scss',
      './package.json': './package.json',
    },
    source: sourcePath,
    main: sourcePath,
    module: sourcePath,
    types: sourcePath,
    files: ['dist/**'],
    scripts: {
      test: 'jest --passWithNoTests',
      build: 'rollup -c && tsc --emitDeclarationOnly --declarationMap false --declaration --declarationDir dist/types',
      lint: `eslint "src/**/*.ts*"`,
      clean: `rm -rf .turbo && rm -rf node_modules && rm -rf dist`,
      'manual-release': 'pnpm run build && pnpm publish --no-git-checks',
    },
    devDependencies: {
      '@types/node': '^20.12.7',
      autoprefixer: '^10.4.19',
      'babel-jest': '29.5.0',
      eslint: '^8.57.0',
      'jest-config': 'workspace:*',
      'rollup-config': 'workspace:*',
      'eslint-config-react-namespace': 'workspace:*',
      postcss: '^8.4.38',
      sass: '^1.75.0',
      'ts-jest': '29.0.5',
      tsconfig: 'workspace:*',
    },
    dependencies: {},
    peerDependencies: {
      react: '^18.0',
    },
    peerDependenciesMeta: {
      '@types/react': {
        optional: true,
      },
      '@types/react-dom': {
        optional: true,
      },
    },

    publishConfig: {
      access: 'public',
      exports: {
        '.': {
          import: {
            types: `./dist/types/index.d.ts`,
            default: `./dist/es/client/${path.basename(sourcePath).replace('ts', 'mjs')}`,
          },
          require: {
            types: `./dist/types/index.d.ts`,
            default: `./dist/cjs/client/${path.basename(sourcePath).replace('ts', 'cjs')}`,
          },
        },
        './index.css': `./dist/es/client/index.css`,
      },
      source: `./src/index.ts`,
      main: `./dist/cjs/client/${path.basename(sourcePath).replace('ts', 'cjs')}`,
      module: `./dist/es/client/${path.basename(sourcePath).replace('ts', 'mjs')}`,
      types: `./dist/types/index.d.ts`,
    },
  }

  return JSON.stringify(packageJson, null, 2)
}
const createSrcIndexts = (srcDir) => {
  const srcIndextsContent = `export {};`
  fs.writeFileSync(path.join(srcDir, 'index.ts'), srcIndextsContent)
}

const createRootIndexts = (projectDir) => {
  const rootIndextsContent = `import './index.scss';

// export * from './src';
`
  fs.writeFileSync(path.join(projectDir, 'index.ts'), rootIndextsContent)
}

const createEslintConfig = (projectDir) => {
  const rootIndextsContent = `module.exports = {
    root: true,
    extends: ["react-namespace"],
  };  
`
  fs.writeFileSync(path.join(projectDir, '.eslintrc.js'), rootIndextsContent)
}

const createIndexScss = (projectDir) => {
  const indexScssContent = ` 
`
  fs.writeFileSync(path.join(projectDir, 'index.scss'), indexScssContent)
}

const createJestConfig = (projectDir) => {
  const jestConfigContent = `const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,
  // 패키지별 설정을 여기에 추가
}

module.exports = customJestConfig
`
  fs.writeFileSync(path.join(projectDir, 'jest.config.js'), jestConfigContent)
}

const createPostcssConfig = (projectDir) => {
  const postcssConfigContent = `module.exports = {
  plugins: [require('autoprefixer')()],
}
`
  fs.writeFileSync(path.join(projectDir, 'postcss.config.js'), postcssConfigContent)
}

const createRollupConfig = (projectDir) => {
  const rollupConfigContent = `import { defaultConfig } from 'rollup-config/rollup.config.mjs'

const config = defaultConfig()
export default config
`
  fs.writeFileSync(path.join(projectDir, 'rollup.config.mjs'), rollupConfigContent)
}

const createSetupTests = (projectDir) => {
  const setupTestsContent = `import '@testing-library/jest-dom'
`
  fs.writeFileSync(path.join(projectDir, 'setupTests.ts'), setupTestsContent)
}

const createTsconfig = (projectDir) => {
  const tsconfigContent = `{
  "extends": "tsconfig/react-library.json",
  "compilerOptions": {
    "baseUrl": "./",

    "paths": {}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.ts"],
  "exclude": ["dist", "build", "node_modules", "**/*.test.*"]
}
`
  fs.writeFileSync(path.join(projectDir, 'tsconfig.json'), tsconfigContent)
}

const createProjectStructure = (packageName, projectDir, sourcePath) => {
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true })
  }

  const srcDir = path.join(projectDir, 'src')
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir)
  }

  // Write package.json
  fs.writeFileSync(path.join(projectDir, 'package.json'), generatePackageJson(packageName, sourcePath))

  // Create other files
  createSrcIndexts(srcDir)
  createRootIndexts(projectDir)
  createIndexScss(projectDir)
  createEslintConfig(projectDir)
  createJestConfig(projectDir)
  createPostcssConfig(projectDir)
  createRollupConfig(projectDir)
  createSetupTests(projectDir)
  createTsconfig(projectDir)

  console.log(`Project structure for ${path.basename(projectDir)} created successfully.`)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (text, defaultValue = '') => {
  return new Promise((resolve) => {
    rl.question(`${text}${defaultValue ? ` (${defaultValue})` : ''}: `, (answer) => resolve(answer || defaultValue))
  })
}

const runPnpmInstall = (projectDir) => {
  return new Promise((resolve, reject) => {
    exec('pnpm install', { cwd: './' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running pnpm install: ${error}`)
        reject(error)
        return
      }
      console.log(stdout)
      console.error(stderr)
      resolve()
    })
  })
}

;(async () => {
  const packageName = await question('Enter the package name (ex- @react-namespace/react-namespace)')

  validatePackageName(packageName)

  const folderPath = path.join('./apps/', packageName.replace(/\//g, '-'))

  console.log(`folders create in ${folderPath}`)
  const sourcePath = './index.ts'
  const projectDir = path.join(folderPath)

  console.log(`entryPoint is ${sourcePath}`)

  createProjectStructure(packageName, projectDir, sourcePath)

  rl.close()
  console.log(`package.json generated and project folder created at ${projectDir}.`)

  console.log('start installing packages....')

  await runPnpmInstall(projectDir)

  console.log('done.')
})()
