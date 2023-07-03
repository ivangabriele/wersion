#!/usr/bin/env node

import { Argument, Option, program } from 'commander'
import { getAbsolutePath } from 'esm-path'
import { readFileSync } from 'fs'

import { main } from './commands/main'

const ROOT_PATH = getAbsolutePath(import.meta.url, '..')

const rootPackageJson = JSON.parse(readFileSync(`${ROOT_PATH}/package.json`, 'utf-8'))

program
  .name('Wersion')
  .description(rootPackageJson.description)
  .version(rootPackageJson.version, '-V, --version', 'Output the current version')
  .helpOption('-h, --help', 'Output usage information')
  .addArgument(
    new Argument('<release>', '').choices([
      'major',
      'minor',
      'patch',
      'premajor',
      'preminor',
      'prepatch',
      'prewersion',
    ]),
  )
  .addOption(
    new Option(
      '-d, --dry-run',
      'Preview the changes that will be made to the file system without actually modifying anything',
    ).default(false),
  )
  .action(main)

program.parse(process.argv)
