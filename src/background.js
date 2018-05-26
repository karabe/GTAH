import GroupRepository from './GroupRepository'
import Group from './Group'

(async () => {
  const repo = new GroupRepository(),
        data = await repo.getAll(),
        addListener = async (tab) => {
          data.add(await repo.hydrate(tab))
          repo.save(data)
        },
        removeListener = (tabId) => {
          data.remove(tabId)
          repo.save(data)
        },
        updateListener = async (tabId, changeInfo, tab) => {
          data.update(await repo.hydrate(tab))
          repo.save(data)
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

      data.addNewGroup(await repo.hydrate(tab))
      repo.save(data)

      browser.tabs.onCreated.addListener(addListener)
    },
    async changeGroup(index) {
      await data.active(index)
      repo.save(data)
    }
  }
  browser.runtime.onMessage.addListener((message) => {
    methods[message.method].apply(undefined, message.args || [])
  })
})()
