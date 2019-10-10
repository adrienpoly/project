import { Entry } from "./entry"
import { SymbolTable } from "./symbol_table"
import { basename } from "path"

export const moduleExtensionPattern = /\.[jt]s$/

export class Module {
  static symbols = new SymbolTable("module")
  readonly logicalPath: string
  readonly entry: Entry

  constructor(logicalPath: string, entry: Entry) {
    this.logicalPath = logicalPath
    this.entry = entry
  }

  get name() {
    return basename(this.logicalPath).replace(moduleExtensionPattern, "")
  }

  get symbol() {
    return Module.symbols.get(this.name)
  }

  get isDirectory() {
    return this.entry.isDirectory
  }

  get manifestImportStatement() {
    return `import ${this.symbol} from ${JSON.stringify(this.manifestImportPath)}`
  }

  get manifestImportPath() {
    return this.isDirectory ? `./${this.name}/@manifest` : `./${this.name}`
  }

  get manifestExportPropertyDefinition() {
    return this.isDirectory ? this.manifestExportSpread : this.manifestExportKeyValuePair
  }

  get manifestExportKeyValuePair() {
    return `${JSON.stringify(this.logicalPath)}: ${this.symbol}`
  }

  get manifestExportSpread() {
    return `...${this.symbol}`
  }
}
