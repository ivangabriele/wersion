import { PackageManager } from './types'

export const PACKAGE_MANAGER_COMMAND_PREFIX: Record<PackageManager, string> = {
  [PackageManager.NPM]: 'npm run',
  [PackageManager.PNPM]: 'pnpm',
  [PackageManager.YARN_CLASSIC]: 'yarn',
  [PackageManager.YARN_BERRY]: 'yarn',
}
