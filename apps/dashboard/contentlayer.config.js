// @ts-check

import { makeSource } from 'contentlayer/source-files'

const config = makeSource({
  contentDirPath: './src/content',
  documentTypes: [],
  disableImportAliasWarning: true,
})

export default config
