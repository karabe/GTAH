import uuidv4 from 'uuid/v4';

export default class {
  constructor(group = {}) {
    this.title = group.title || 'Default'
    this.tabs = group.tabs || []
    this.uuid = group.uuid || uuidv4()
    this.activeTabId = group.activeTabId || null
  }

  conv(tab) {
    return {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      hidden: tab.hidden
    }
  }

  add(tab) {
    this.tabs.push(this.conv(tab))
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

    this.tabs[index] = this.conv(tab)

    if (tab.active) {
      this.activeTabId = tab.id
    }
  }

  addTabs(tabs) {
    tabs.forEach((tab) => {
      this.add(tab)
    })
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
