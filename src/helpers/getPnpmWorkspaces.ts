import { normalize } from 'path'

import { isFile } from './isFile'
import { readYamlFile } from './readYamlFile'
import { UserError } from '../libs/UserError'

type PnpmWorkspaceYaml = {
  packages?: string[]
}

export async function getPnpmWorkspaces(projectRootPath: string): Promise<string[]> {
  const pnpmWorkspaceFilePath = normalize(`${projectRootPath}/pnpm-workspace.yaml`)
  if (!(await isFile(pnpmWorkspaceFilePath))) {
    throw new UserError(`Unable to find ${pnpmWorkspaceFilePath}.`)
  }

  const pnpmWorkspaceFileData = await readYamlFile<PnpmWorkspaceYaml>(pnpmWorkspaceFilePath)
  if (!pnpmWorkspaceFileData.packages) {
    throw new UserError(`There is no "packages" field in ${pnpmWorkspaceFilePath}.`)
  }

  return pnpmWorkspaceFileData.packages
}
