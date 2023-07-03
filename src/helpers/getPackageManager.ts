import { promises as fs } from 'fs'

import { PackageManager } from '../types'

export async function getPackageManager(projectRootPath: string): Promise<PackageManager> {
  // List files and directories in projectRootPath
  const projectRootPathFiles = await fs.readdir(projectRootPath)

  switch (true) {
    case projectRootPathFiles.includes('yarn.lock') && projectRootPathFiles.includes('.yarn'):
      return PackageManager.YARN_3

    case projectRootPathFiles.includes('yarn.lock'):
      return PackageManager.YARN_1

    case projectRootPathFiles.includes('pnpm-lock.yaml'):
      return PackageManager.PNPM

    case projectRootPathFiles.includes('package-lock.json'):
      return PackageManager.NPM

    default:
      throw new Error('Unable to detect package manager.')
  }
}
