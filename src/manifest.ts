import { VirtualFile } from "./entry"
import { Module } from "./module"
import { Reflection } from "./reflection"
import { Tree } from "./tree"
import { join } from "path"

export class Manifest implements Reflection {
  readonly directoryPath: string
  readonly moduleTree: Tree

  constructor(directoryPath: string, moduleTree: Tree) {
    this.directoryPath = directoryPath
    this.moduleTree = moduleTree
  }

  get path() {
    return join(this.directoryPath, "@manifest.js")
  }

  get modules() {
    return this.moduleTree.entries.map(([path, entry]) => new Module(path, entry))
  }

  get importStatements() {
    return this.modules.map(mod => mod.manifestImportStatement)
  }

  get exportStatement() {
    return `export default { ${this.modules.map(mod => mod.manifestExportPropertyDefinition).join(", ")} }`
  }

  get contents() {
    return [...this.importStatements, this.exportStatement, ""].join("\n")
  }

  get generatedFile() {
    return new VirtualFile(this.path, this.contents)
  }
}
