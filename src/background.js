import Center from './Center'

(async () => {
  const center = new Center
  await center.init()
  center.addListeners()
})()
