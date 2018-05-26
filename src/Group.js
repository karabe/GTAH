export default class {
  constructor(group = {}) {
    this.title = group.title || 'Default'
    this.tabs = group.tabs || []
    this.activeTabId = group.activeTabId || null
  }

  add(tab) {
    this.tabs.push(tab)
  }

  remove(tabId) {
    const index = this.tabs.findIndex((tab) => {
      return tab.id === tabId
    })

    if (index === -1) return

    this.tabs.splice(index, 1)
  }

  update(tab) {
    const index = this.tabs.findIndex((ctab) => {
      return ctab.id === tab.id
    })

    if (index === -1) return

    this.tabs[index] = tab

    if (tab.active) {
      this.activeTabId = tab.id
    }
  }

  async show() {
    const tabIds = this.tabs.map((tab) => {
      return tab.id
    })

    await browser.tabs.show(tabIds)
  }

  async active() {
    const tab = this.tabs.find((tab) => {
      return tab.id === this.activeTabId
    }) || this.tabs[0]

    await browser.tabs.update(tab.id, {active: true})
  }

  async hide() {
    const tabIds = this.tabs.map((tab) => {
      return tab.id
    })

    await browser.tabs.hide(tabIds)
  }
}
