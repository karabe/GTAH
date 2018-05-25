import GroupsController from './GroupsController'

let controller = new GroupsController()

browser.tabs.query({currentWindow: true})
  .then((tabs) => {
    controller.init(tabs)
  })

browser.tabs.onCreated.addListener((tab) => { controller.add(tab) })
browser.tabs.onAttached.addListener((tab) => { controller.add(tab) })

browser.tabs.onRemoved.addListener((tabId) => { controller.remove(tabId) })
browser.tabs.onDetached.addListener((tabId) => { controller.remove(tabId) })

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  controller.update(tab)
})
