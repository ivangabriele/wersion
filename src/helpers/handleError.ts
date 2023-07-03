import { UserError } from '../libs/UserError'

export function handleError(error: unknown, isFinal = false) {
  if (!isFinal) {
    throw error
  }

  if (error instanceof UserError) {
    console.error(['', `Error: ${error.message}`, ''].join('\n'))

    process.exit(1)
  }

  console.error(
    [
      '',
      '==============================================================================',
      `Original Error Message: ${error}`,
      'Original Error Value:',
    ].join('\n'),
  )
  console.error(error)
  console.error(
    [
      '==============================================================================',
      '',
      'Error: An internal error occurred.',
      'Please file an issue at https://github.com/ivangabriele/wersion/issues with this output.',
      '',
    ].join('\n'),
  )
  process.exit(1)
}
