import { Application } from "./application"
import definitions from "./controllers/definitions"

void async function() {
  const application = new Application()
  application.load(definitions)
  await application.start()
}()
