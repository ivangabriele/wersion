import { PackageManager } from './types'

export const PACKAGE_MANAGER_COMMAND_PREFIX: Record<PackageManager, string> = {
  [PackageManager.NPM]: 'npm',
  [PackageManager.PNPM]: 'pnpm',
  [PackageManager.YARN_1]: 'yarn',
  [PackageManager.YARN_3]: 'yarn',
}
