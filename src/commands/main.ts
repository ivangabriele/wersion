#!/usr/bin/env node

import fastGlob from 'fast-glob'
import { promises as fs } from 'fs'
import { normalize } from 'path'
import { pkgUp } from 'pkg-up'
import { type ReleaseType } from 'semver'
import semverInc from 'semver/functions/inc'

import { PACKAGE_MANAGER_COMMAND_PREFIX } from '../constants'
import { exec } from '../helpers/exec'
import { getPackageManager } from '../helpers/getPackageManager'
import { getProjectRootPath } from '../helpers/getProjectRootPath'
import { handleError } from '../helpers/handleError'
import { isFile } from '../helpers/isFile'
import { logDiff } from '../helpers/logDiff'
import { readJsonFile } from '../helpers/readJsonFile'
import { UserError } from '../libs/UserError'
import { PackageManager } from '../types'

type Options = {
  dryRun: boolean
}

type Package = {
  data: PackageJson
  json: string
  path: string
}
interface PackageJson {
  scripts: Record<string, string> | undefined
  version: string | undefined
  workspaces: string[] | undefined
}

export async function main(release: ReleaseType, options: Options) {
  try {
    // -------------------------------------------------------------------------
    // Current root package

    const rootPackagePath = await pkgUp()
    if (!rootPackagePath) {
      throw new UserError(
        `Unable to find a package.json file in the current or above directories (path: ${process.cwd()}).`,
      )
    }
    const rootPackageData = await readJsonFile<PackageJson>(rootPackagePath)
    // eslint-disable-next-line no-null/no-null
    const rootPackageJson = JSON.stringify(rootPackageData, null, 2)

    // -------------------------------------------------------------------------
    // Constants

    const projectRootPath = await getProjectRootPath()
    const packageManager = await getPackageManager(projectRootPath)
    const [packageManagerCommand, packageManagerCommandRunArgs] = PACKAGE_MANAGER_COMMAND_PREFIX[packageManager]
    const { version } = rootPackageData
    if (!version) {
      throw new UserError(`There is no "version" field in ${rootPackagePath}.`)
    }
    const { workspaces } = rootPackageData
    if (!workspaces) {
      throw new UserError(`There is no "workspaces" fields in ${rootPackagePath}.`)
    }

    // -------------------------------------------------------------------------
    // Current workspaces packages

    const workspacesPaths = await fastGlob(workspaces, {
      absolute: true,
      cwd: projectRootPath,
      onlyDirectories: true,
    })
    const workspacePackages: Package[] = await Promise.all(
      workspacesPaths.map(async workspacePath => {
        const packagePath = normalize(`${workspacePath}/package.json`)
        if (!(await isFile(packagePath))) {
          throw new UserError(`Unable to find ${packagePath}.`)
        }
        const packageJson = await readJsonFile<PackageJson>(packagePath)

        return {
          data: packageJson,
          // eslint-disable-next-line no-null/no-null
          json: JSON.stringify(packageJson, null, 2),
          path: packagePath,
        }
      }),
    )

    // -------------------------------------------------------------------------
    // Next version calculation

    const nextVersion = semverInc(version, release)
    if (!nextVersion) {
      throw new Error('`nextVersion` is undefined.')
    }

    // -------------------------------------------------------------------------
    // Next root package

    const nextRootPackageData: PackageJson = {
      ...rootPackageData,
      version: nextVersion,
    }

    // -------------------------------------------------------------------------
    // Next workspaces packages

    const nextWorkspacePackages: Package[] = workspacePackages.map(workspacePackage => ({
      ...workspacePackage,
      data: {
        ...workspacePackage.data,
        version: nextVersion,
      },
    }))

    // -------------------------------------------------------------------------
    // Prerelease script

    if (rootPackageData.scripts?.prerelease && packageManager !== PackageManager.YARN_CLASSIC) {
      await exec(packageManagerCommand, [...packageManagerCommandRunArgs, 'prerelease'], options.dryRun)
    }

    // -------------------------------------------------------------------------
    // Next root package update

    // eslint-disable-next-line no-null/no-null
    const nextRootPackageJson = JSON.stringify(nextRootPackageData, null, 2)

    console.info(`Changes applied to ${rootPackagePath}${options.dryRun ? ' (Dry Run)' : ''}:`)
    logDiff(rootPackageJson, nextRootPackageJson)
    console.info()

    if (!options.dryRun) {
      await fs.writeFile(rootPackagePath, nextRootPackageJson)
    }

    // -------------------------------------------------------------------------
    // Next workspaces packages

    await Promise.all(
      nextWorkspacePackages.map(async ({ data, path }) => {
        const currentWorkspacePackage = workspacePackages.find(workspacePackage => workspacePackage.path === path)
        if (!currentWorkspacePackage) {
          throw new Error(`Unable to find current workspace package with path: ${path}.`)
        }
        // eslint-disable-next-line no-null/no-null
        const nextWorkspacePackageJson = JSON.stringify(data, null, 2)

        console.info(`Changes applied to ${path}${options.dryRun ? ' (Dry Run)' : ''}:`)
        logDiff(currentWorkspacePackage.json, nextWorkspacePackageJson)
        console.info()

        if (!options.dryRun) {
          await fs.writeFile(path, nextWorkspacePackageJson)
        }
      }),
    )

    await exec(
      packageManagerCommand,
      [PackageManager.YARN_CLASSIC, PackageManager.YARN_BERRY].includes(packageManager) ? [] : ['i'],
      options.dryRun,
    )
    await exec('git', ['add', '.'], options.dryRun)
    await exec('git', ['commit', '-m', `ci(release): ${nextVersion}`, '--no-verify'], options.dryRun)
    await exec('git', ['tag', `v${nextVersion}`], options.dryRun)

    // -------------------------------------------------------------------------
    // Postrelease script

    if (rootPackageData.scripts?.postrelease && packageManager !== PackageManager.YARN_CLASSIC) {
      await exec(packageManagerCommand, [...packageManagerCommandRunArgs, 'postrelease'], options.dryRun)
    }
  } catch (err) {
    handleError(err, true)
  }
}
