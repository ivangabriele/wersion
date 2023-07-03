import { normalize } from 'path'
import { pkgUp } from 'pkg-up'

import { UserError } from '../libs/UserError'

export async function getProjectRootPath(): Promise<string> {
  const rootPackagePath = await pkgUp()
  if (!rootPackagePath) {
    throw new UserError(
      `Unable to find a package.json file in the current or above directories (path: ${process.cwd()}).`,
    )
  }

  const projectRootPath = normalize(rootPackagePath.replace('package.json', ''))

  return projectRootPath
}
