import chalk from 'chalk'

export function logDiff(previous: string, next: string): void {
  const previousLines = previous.split('\n')
  const nextLines = next.split('\n')

  previousLines.forEach((previousLine, index) => {
    const nextLine = nextLines[index]

    if (previousLine !== nextLine) {
      console.info(chalk.red(`${index}. - ${previousLine}`))
      console.info(chalk.green(`${index}. + ${nextLine}`))
    }
  })
}
