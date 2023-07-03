import { promises as fs } from 'fs'
import { parse } from 'yaml'

export async function readYamlFile<T = any>(filePath: string): Promise<T> {
  const fileContent = await fs.readFile(filePath, 'utf-8')

  return parse(fileContent)
}
