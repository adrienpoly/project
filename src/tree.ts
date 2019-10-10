import { SourceDirectory } from "./entry"
import { EntryMap, createEntryMap } from "./entry_map"
import { moduleExtensionPattern } from "./module"
import { dirname } from "path"

export class Tree {
  readonly entryMap: EntryMap

  constructor(entryMap: EntryMap = {}) {
    this.entryMap = entryMap
  }

  get entries() {
    return Object.entries(this.entryMap)
  }

  get directoryEntries(): [string, SourceDirectory][] {
    return this.entries.filter(([path, entry]) => entry.isDirectory) as any
  }

  get fileEntries() {
    return this.entries.filter(([path, entry]) => !entry.isDirectory)
  }

  get paths() {
    return Object.keys(this.entryMap)
  }

  get directoryPaths() {
    return this.directoryEntries.map(([path]) => path)
  }

  get filePaths() {
    return this.fileEntries.map(([path]) => path)
  }

  get modulePaths() {
    return [
      ...this.directoryPaths,
      ...this.filePaths.filter(path => path.match(moduleExtensionPattern))
    ]
  }

  shadow(tree: Tree) {
    return new Tree({ ...tree.entryMap, ...this.entryMap })
  }

  slice(...paths: string[]) {
    return new Tree(paths.reduce((entryMap, path) => {
      return { ...entryMap, [path]: this.entryMap[path] }
    }, {}))
  }

  sliceDirectory(directoryPath: string) {
    const modulePaths = this.modulePaths.filter(path => dirname(path) == directoryPath)
    return this.slice(...modulePaths)
  }
}

export async function createTree(path: string) {
  const directory = new SourceDirectory(path)
  const entryMap = await createEntryMap(directory)
  return new Tree(entryMap)
}
