import { PackageManager } from './types'

export const PACKAGE_MANAGER_NAME: Record<PackageManager, string> = {
  [PackageManager.NPM]: 'npm',
  [PackageManager.PNPM]: 'pnpm',
  [PackageManager.YARN_CLASSIC]: 'Yarn Classic',
  [PackageManager.YARN_BERRY]: 'Yarn Berry',
}

export const PACKAGE_MANAGER_COMMAND_PREFIX: Record<PackageManager, [string, string[]]> = {
  [PackageManager.NPM]: ['npm', ['run']],
  [PackageManager.PNPM]: ['pnpm', []],
  [PackageManager.YARN_CLASSIC]: ['yarn', []],
  [PackageManager.YARN_BERRY]: ['yarn', []],
}
