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
        },
        activatedListener = async (activeInfo) => {
          await data.activated(activeInfo.tabId)
          repo.save(data)
        },
        movedListener = async (tabId) => {
          await data.refresh(tabId)
          repo.save(data)
        }

  browser.tabs.onCreated.addListener(createdListener)
  browser.tabs.onRemoved.addListener(removedListener)
  browser.tabs.onUpdated.addListener(updatedListener)
  browser.tabs.onActivated.addListener(activatedListener)
  browser.tabs.onMoved.addListener(movedListener)

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
      browser.tabs.onActivated.removeListener(activatedListener)

      await data.active(index)
      repo.save(data)

      browser.tabs.onActivated.addListener(activatedListener)
    },
    updateTitle(index, title) {
      data.updateTitle(index, title)
      repo.save(data)
    },
    async deleteGroup(index) {
      browser.tabs.onRemoved.removeListener(removedListener)

      await data.deleteGroup(index)
      repo.save(data)

      browser.tabs.onRemoved.addListener(removedListener)
    }
  }
  browser.runtime.onMessage.addListener((message) => {
    methods[message.method].apply(undefined, message.args || [])
  })
})()
