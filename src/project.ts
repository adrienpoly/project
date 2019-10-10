import { EntryMap } from "./entry_map"
import { Manifest } from "./manifest"
import { Reflection } from "./reflection"
import { Tree } from "./tree"
import { join } from "path"

export class Project {
  readonly sourceTree: Tree
  readonly templateTree: Tree
  readonly inputTree: Tree

  constructor(sourceTree: Tree, templateTree: Tree) {
    this.sourceTree = sourceTree
    this.templateTree = templateTree
    this.inputTree = this.sourceTree.shadow(this.templateTree)
  }

  async build(targetPath: string) {
    const { outputTree: { directoryEntries, fileEntries } } = this

    for (const [logicalPath, entry] of directoryEntries) {
      const path = join(targetPath, logicalPath)
      await entry.build(path)
    }

    return Promise.all(fileEntries.map(([logicalPath, entry]) => {
      const path = join(targetPath, logicalPath)
      return entry.build(path)
    }))
  }

  get outputTree() {
    return this.inputTree.shadow(this.reflectionTree)
  }

  get reflectionTree() {
    return new Tree(this.reflectionEntryMap)
  }

  get reflectionEntryMap() {
    return this.reflections.reduce((entryMap, reflection) => ({
      ...entryMap, [reflection.path]: reflection.generatedFile
    }), {} as EntryMap)
  }

  get reflections(): Reflection[] {
    return this.directoryPaths.map(directoryPath => this.manifestForDirectory(directoryPath))
  }

  get directoryPaths() {
    return this.inputTree.directoryPaths
  }

  manifestForDirectory(directoryPath: string) {
    const moduleTree = this.inputTree.sliceDirectory(directoryPath)
    return new Manifest(directoryPath, moduleTree)
  }
}
