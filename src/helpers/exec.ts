import { execa, Options } from 'execa'
import { pkgUp } from 'pkg-up'

export async function exec(command: string, args: string[], isDryRun = false): Promise<void> {
  const projectRootPath = await pkgUp()
  if (!projectRootPath) {
    throw new Error('`projectRootPath` is undefined.')
  }

  const quotedArgs = args.map(arg => (arg.includes(' ') ? `"${arg}"` : arg))
  const statement = `${command} ${quotedArgs.join(' ')}`

  const options: Options = {
    cwd: projectRootPath,
  }

  console.info(`Running: \`${statement}\`${isDryRun ? ' (Dry Run)' : ''}...`)
  if (!isDryRun) {
    const execaChildProcess = await execa(command, args, options)

    if (execaChildProcess.stderr.length > 0) {
      console.error(execaChildProcess.stderr)
      throw new Error(`Command \`${statement}\` failed.`)
    }
  }
}
