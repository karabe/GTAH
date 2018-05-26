import GroupRepository from './GroupRepository'
import Group from './Group'

(async () => {
  const repo = new GroupRepository(),
        data = await repo.getAll(),
        createdListener = async (tab) => {
          data.add(await repo.hydrate(tab))
          repo.save(data)
        },
        removedListener = (tabId) => {
          data.remove(tabId)
          repo.save(data)
        },
        updatedListener = async (tabId, changeInfo, tab) => {
          data.update(await repo.hydrate(tab))
          repo.save(data)
        }

  browser.tabs.onCreated.addListener(createdListener)

  browser.tabs.onRemoved.addListener(removedListener)

  browser.tabs.onUpdated.addListener(updatedListener)

  const methods = {
    async addNewGroup() {
      browser.tabs.onCreated.removeListener(createdListener)

      const tab = await browser.tabs.create({active: false})
      browser.tabs.hide(tab.id)

      data.addNewGroup(await repo.hydrate(tab))
      repo.save(data)

      browser.tabs.onCreated.addListener(createdListener)
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
