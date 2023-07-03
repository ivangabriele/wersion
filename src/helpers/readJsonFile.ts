import { promises as fs } from 'fs'

import { UserError } from '../libs/UserError'

export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  try {
    const fileSource = await fs.readFile(filePath, 'utf-8')
    const fileData = JSON.parse(fileSource)

    return fileData
  } catch (error: any) {
    throw new UserError(`Unable to parse ${filePath}.`)
  }
}
