import { VirtualFile } from "./entry"

export interface Reflection {
  readonly path: string
  readonly generatedFile: VirtualFile
}
