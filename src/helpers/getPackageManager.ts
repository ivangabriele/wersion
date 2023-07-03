import { promises as fs } from 'fs'
import { normalize } from 'path'

import { PackageManager } from '../types'

export async function getPackageManager(projectRootPath: string): Promise<PackageManager> {
  const projectRootPathFiles = await fs.readdir(projectRootPath)

  switch (true) {
    case projectRootPathFiles.includes('yarn.lock'):
      // eslint-disable-next-line no-case-declarations
      const yarnLockFileSource = await fs.readFile(normalize(`${projectRootPath}/yarn.lock`), 'utf-8')

      return yarnLockFileSource.includes('yarn lockfile v1') ? PackageManager.YARN_CLASSIC : PackageManager.YARN_BERRY

    case projectRootPathFiles.includes('pnpm-lock.yaml'):
      return PackageManager.PNPM

    case projectRootPathFiles.includes('package-lock.json'):
      return PackageManager.NPM

    default:
      throw new Error('Unable to detect package manager.')
  }
}
