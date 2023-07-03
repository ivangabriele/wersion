import { getWersionPackage } from './getWersionPackage'

const WERSION_PACKAGE = getWersionPackage()

const INTRO = `

  (_|   |   |_/            o
    |   |   | _   ,_    ,      __   _  _
    |   |   ||/  /  |  / \\_|  /  \\_/ |/ |
    \\_/ \\_/ |__/   |_/ \\/ |_/\\__/   |  |_/

    v${WERSION_PACKAGE.version}
`

export function initializeConsole() {
  console.clear()

  console.info(INTRO)
}
