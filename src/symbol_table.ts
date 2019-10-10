export class SymbolTable {
  readonly name: string
  readonly values: string[] = []

  constructor(name: string) {
    this.name = name
  }

  get(value: string) {
    let index = this.values.indexOf(value)
    if (index == -1) {
      index = this.values.length
      this.values.push(value)
    }

    return [this.name, index].join("$")
  }
}
