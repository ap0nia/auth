// @ts-check

import { makeSource } from 'contentlayer/source-files'

const config = makeSource({
  contentDirPath: './src/content',
  documentTypes: [],
})

export default config
