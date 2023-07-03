import { Argument, Option, program } from 'commander'

import { main } from './commands/main'
import { getWersionPackage } from './helpers/getWersionPackage'

const WERSION_PACKAGE = getWersionPackage()

program
  .name('Wersion')
  .description(String(WERSION_PACKAGE.description))
  .version(String(WERSION_PACKAGE.version), '-V, --version', 'Output the current version')
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
