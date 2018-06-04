import GroupRepository from './GroupRepository'

export default class {
  constructor() {
    this.repo = new GroupRepository

    this.listeners = {
      created: async (tab) =>  {
        await this.data.add(tab)
        this.repo.save(this.data)
      },
      removed: async (tabId) => {
        await this.data.remove(tabId)
        this.repo.save(this.data)
      },
      updated: async (tabId, changeInfo, tab) => {
        await this.data.update(tab)
        this.repo.save(this.data)
      },
      activated: async (activeInfo) => {
        await this.data.activated(activeInfo.tabId)
        this.repo.save(this.data)
      },
      moved: async (tabId, moveInfo) => {
        const tabs = await browser.tabs.query({windowId: moveInfo.windowId})
        await this.data.refresh(tabs)
        this.repo.save(this.data)
      },
      message: async (message) => {
        await this.methods[message.method].apply(undefined, message.args || [])
      }
    }

    this.methods = {
      addNewGroup: async () => {
        browser.tabs.onCreated.removeListener(this.listeners.created)

        await this.data.addNewGroup()
        this.repo.save(this.data)

        browser.tabs.onCreated.addListener(this.listeners.created)
      },
      changeGroup: async (index) => {
        browser.tabs.onActivated.removeListener(this.listeners.activated)

        await this.data.active(index)
        this.repo.save(this.data)

        browser.tabs.onActivated.addListener(this.listeners.activated)
      },
      updateTitle: async (index, title) => {
        this.data.updateTitle(index, title)
        this.repo.save(this.data)
      },
      deleteGroup: async (index) => {
        browser.tabs.onRemoved.removeListener(this.listeners.removed)

        await this.data.deleteGroup(index)
        this.repo.save(this.data)

        browser.tabs.onRemoved.addListener(this.listeners.removed)
      },
      moveToAnotherGroup: async (tabId, index) => {
        await this.data.moveToAnotherGroup(tabId, index)
        this.repo.save(this.data)
      }
    }
  }

  async init() {
    this.data = await this.repo.getAll()
    this.repo.save(this.data)
  }

  addListeners() {
    browser.tabs.onCreated.addListener(this.listeners.created)
    browser.tabs.onRemoved.addListener(this.listeners.removed)
    browser.tabs.onUpdated.addListener(this.listeners.updated)
    browser.tabs.onActivated.addListener(this.listeners.activated)
    browser.tabs.onMoved.addListener(this.listeners.moved)

    browser.runtime.onMessage.addListener(this.listeners.message)
  }
}
