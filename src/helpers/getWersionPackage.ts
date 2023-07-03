import { getAbsolutePath } from 'esm-path'
import { readFileSync } from 'fs'

import { PackageJson } from '../types'

const ROOT_PATH = getAbsolutePath(import.meta.url, '..')
const WERSION_PACKAGE: PackageJson = JSON.parse(readFileSync(`${ROOT_PATH}/package.json`, 'utf-8'))

export function getWersionPackage(): PackageJson {
  return WERSION_PACKAGE
}
