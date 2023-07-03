import { promises as fs } from 'fs'

export async function isFile(filePath: string) {
  try {
    const fileStat = await fs.stat(filePath)

    return fileStat.isFile()
  } catch (error: any) {
    if (error && error.code === 'ENOENT') {
      return false
    }

    throw error
  }
}
