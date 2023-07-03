export type Package = {
  data: PackageJson
  json: string
  path: string
}

export interface PackageJson {
  description: Record<string, string> | undefined
  scripts: Record<string, string> | undefined
  version: string | undefined
  workspaces: string[] | undefined
}

export enum PackageManager {
  'NPM' = 'NPM',
  'PNPM' = 'PNPM',
  'YARN_BERRY' = 'YARN_BERRY',
  'YARN_CLASSIC' = 'YARN_CLASSIC',
}
