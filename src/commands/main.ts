#!/usr/bin/env node

import fastGlob from 'fast-glob'
import { promises as fs } from 'fs'
import { normalize } from 'path'
import { pkgUp } from 'pkg-up'
import { type ReleaseType } from 'semver'
import semverInc from 'semver/functions/inc'

import { PACKAGE_MANAGER_COMMAND_PREFIX, PACKAGE_MANAGER_NAME } from '../constants'
import { exec } from '../helpers/exec'
import { getPackageManager } from '../helpers/getPackageManager'
import { getPnpmWorkspaces } from '../helpers/getPnpmWorkspaces'
import { getProjectRootPath } from '../helpers/getProjectRootPath'
import { handleError } from '../helpers/handleError'
import { initializeConsole } from '../helpers/initializeConsole'
import { isFile } from '../helpers/isFile'
import { logDiff } from '../helpers/logDiff'
import { readJsonFile } from '../helpers/readJsonFile'
import { spinner } from '../libs/spinner'
import { UserError } from '../libs/UserError'
import { Package, PackageJson, PackageManager } from '../types'

type Options = {
  dryRun: boolean
}

export async function main(release: ReleaseType, options: Options) {
  initializeConsole()
  console.info('――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――')

  try {
    // -------------------------------------------------------------------------
    // Current root package

    spinner.start('Reading root package.json...')

    const rootPackagePath = await pkgUp()
    if (!rootPackagePath) {
      throw new UserError(`Unable to find a package.json file neither in ${process.cwd()} nor its parent directories).`)
    }
    const rootPackageData = await readJsonFile<PackageJson>(rootPackagePath)
    // eslint-disable-next-line no-null/no-null
    const rootPackageJson = JSON.stringify(rootPackageData, null, 2)

    spinner.succeed('Root package.json read')

    // -------------------------------------------------------------------------
    // Constants

    spinner.start('Parsing current version and workspaces...')

    const projectRootPath = await getProjectRootPath()
    const packageManager = await getPackageManager(projectRootPath)
    const [packageManagerCommand, packageManagerCommandRunArgs] = PACKAGE_MANAGER_COMMAND_PREFIX[packageManager]
    const { version } = rootPackageData
    if (!version) {
      throw new UserError(`There is no "version" field in ${rootPackagePath}.`)
    }
    const workspaces =
      packageManager === PackageManager.PNPM ? await getPnpmWorkspaces(projectRootPath) : rootPackageData.workspaces
    if (!workspaces) {
      throw new UserError(`There is no "workspaces" field in ${rootPackagePath}.`)
    }

    spinner.succeed('Current version and workspaces parsed')

    // -------------------------------------------------------------------------
    // Current workspaces packages

    spinner.start('Reading workspaces package.json...')

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

    spinner.succeed('Workspaces package.json read')

    // -------------------------------------------------------------------------
    // Next version calculation

    spinner.start('Calculating next version...')

    const nextVersion = semverInc(version, release)
    if (!nextVersion) {
      throw new Error('`nextVersion` is undefined.')
    }

    process.env.PREVIOUS_VERSION = version
    process.env.NEXT_VERSION = nextVersion

    spinner.succeed('Next version calculated')

    console.info('――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――')
    console.info(`Package Manager: ${PACKAGE_MANAGER_NAME[packageManager]}`)
    console.info(`Previous Monorepo Version: v${version}`)
    console.info(`Next Monorepo Version: v${nextVersion}`)
    console.info(`Detected Workspaces:`)
    workspacesPaths.forEach(workspacePath => console.info(`  - ${workspacePath}`))
    console.info('――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――')

    spinner.start('Preparing packages updates...')

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

    spinner.start('Packages updates ready.')

    // -------------------------------------------------------------------------
    // Prewersion script

    if (rootPackageData.scripts?.prewersion) {
      await exec(packageManagerCommand, [...packageManagerCommandRunArgs, 'prewersion'], options.dryRun)
    }

    console.info('――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――')

    // -------------------------------------------------------------------------
    // Next root package update

    // eslint-disable-next-line no-null/no-null
    const nextRootPackageJson = JSON.stringify(nextRootPackageData, null, 2)

    console.info(`Changes applied to ${rootPackagePath}${options.dryRun ? ' (Dry Run)' : ''}:`)
    logDiff(rootPackageJson, nextRootPackageJson)

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

        if (!options.dryRun) {
          await fs.writeFile(path, nextWorkspacePackageJson)
        }
      }),
    )

    console.info('――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――')

    if (packageManager === PackageManager.YARN_BERRY) {
      await exec('yarn', [], options.dryRun)
    }
    await exec('git', ['add', '.'], options.dryRun)
    await exec('git', ['commit', '-m', `ci(release): ${nextVersion}`, '--no-verify'], options.dryRun)
    await exec('git', ['tag', `v${nextVersion}`], options.dryRun)

    // -------------------------------------------------------------------------
    // Postwersion script

    if (rootPackageData.scripts?.postwersion) {
      await exec(packageManagerCommand, [...packageManagerCommandRunArgs, 'postwersion'], options.dryRun)
    }

    console.info('――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――')
  } catch (err) {
    spinner.fail('An error happened.')

    console.info('――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――')

    handleError(err, true)
  }
}
