import { execa, Options } from 'execa'

import { getProjectRootPath } from './getProjectRootPath'

export async function exec(command: string, args: string[], isDryRun = false): Promise<void> {
  const projectRootPath = await getProjectRootPath()
  const options: Options = {
    cwd: projectRootPath,
  }
  const quotedArgs = args.map(arg => (arg.includes(' ') ? `"${arg}"` : arg))
  const statement = `${command} ${quotedArgs.join(' ')}`.trim()

  console.info(`Running: \`${statement}\`${isDryRun ? ' (Dry Run)' : ''} in ${projectRootPath}...`)
  if (!isDryRun) {
    const execaChildProcess = await execa(command, args, options)

    if (execaChildProcess.stderr.length > 0) {
      console.error(execaChildProcess.stderr)
      throw new Error(`Command \`${statement}\` failed.`)
    }
  }
}
