import { Dirent, promises as fs } from "fs"
import { join, relative, resolve } from "path"

export class Entry {
  static for(root: string, dirent: Dirent) {
    const path = join(root, dirent.name)
    if (dirent.isDirectory()) {
      return new SourceDirectory(path)
    } else if (dirent.isFile()) {
      return new SourceFile(path)
    }
  }

  readonly path: string
  readonly isDirectory: boolean = false

  constructor(path: string) {
    this.path = resolve(path)
  }

  build(path: string) {
    return Promise.resolve()
  }

  relativeTo(path: string) {
    return relative(path, this.path)
  }
}

export class SourceFile extends Entry {
  build(path: string) {
    return fs.link(this.path, path)
  }
}

export class VirtualFile extends Entry {
  readonly contents: string

  constructor(path: string, contents: string) {
    super(path)
    this.contents = contents
  }

  build(path: string) {
    return fs.writeFile(path, this.contents)
  }
}

export class SourceDirectory extends Entry {
  readonly isDirectory = true

  build(path: string) {
    return fs.mkdir(path, { recursive: true })
  }

  get entries() {
    return fs.readdir(this.path, { withFileTypes: true }).then(dirents => {
      return dirents.reduce((entries, dirent) => {
        const entry = Entry.for(this.path, dirent)
        return entry ? [...entries, entry] : entries
      }, [] as Entry[])
    })
  }
}
