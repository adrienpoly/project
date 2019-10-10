import { Entry, SourceDirectory } from "./entry"

export type EntryMap = { [logicalPath: string]: Entry }

export async function createEntryMap(directory: SourceDirectory, root = directory.path) {
  const entryMap: EntryMap = {}
  const entries = await directory.entries

  for (const entry of entries) {
    const logicalPath = entry.relativeTo(root)
    entryMap[logicalPath] = entry

    if (entry instanceof SourceDirectory) {
      Object.assign(entryMap, await createEntryMap(entry, root))
    }
  }

  return entryMap
}
