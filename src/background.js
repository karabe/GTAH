import GroupRepository from './GroupRepository'
import Group from './Group'

(async () => {
  const repo = new GroupRepository(),
        groups = await repo.getAll(),
        addListener = (tab) => {
          groups.add(tab)
          repo.save(groups)
        },
        removeListener = (tabId) => {
          groups.remove(tabId)
          repo.save(groups)
        },
        updateListener = (tabId, changeInfo, tab) => {
          groups.update(tab)
          repo.save(groups)
        }

  browser.tabs.onCreated.addListener(addListener)
  browser.tabs.onAttached.addListener(addListener)

  browser.tabs.onRemoved.addListener(removeListener)
  browser.tabs.onDetached.addListener(removeListener)

  browser.tabs.onUpdated.addListener(updateListener)

  const methods = {
    async addNewGroup() {
      browser.tabs.onCreated.removeListener(addListener)

      const tab = await browser.tabs.create({active: false})
      browser.tabs.hide(tab.id)

      groups.addNewGroup(tab)
      repo.save(groups)

      browser.tabs.onCreated.addListener(addListener)
    }
  }
  browser.runtime.onMessage.addListener((message) => {
    methods[message.method]()
  })
})()
