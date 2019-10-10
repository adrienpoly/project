import { Project, createTree } from "./index"
import { join } from "path"

void async function() {
  const sourcePath = process.argv[2] ? process.argv[2] : "."
  const sourceTree = await createTree(sourcePath)

  const templatePath = join(__dirname, "..", "template")
  const templateTree = await createTree(templatePath)

  const project = new Project(sourceTree, templateTree)
  const targetPath = process.argv[3] ? process.argv[3] : "build"
  await project.build(targetPath)
}()
