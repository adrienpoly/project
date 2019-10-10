import manifest from "./@manifest"

export default manifest.reduce((definitions, [path, controllerConstructor]) => {
  const identifier = controllerIdentifierForPath(path)
  return [...definitions, ...identifier ? [[identifier, controllerConstructor]] : []]
}, [])

function controllerIdentifierForPath(path) {
  const matches = path.toString().match(/^controllers\/(.+?)[_-]controller\.[jt]s$/)
  if (matches) {
    return matches[1]
      .replace(/\//g, "--")
      .replace(/_/g, "-")
  }
}
