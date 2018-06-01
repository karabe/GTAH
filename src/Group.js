import GroupRepository from './GroupRepository'
import Converter from './Converter'

export default class {
  constructor(group = {}) {
    this.title = group.title || 'Default'
    this.tabs = group.tabs || []
    this.activeTabId = group.activeTabId || null

    this.converter = new Converter
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

  isEmpty() {
    return this.tabs.length === 0
  }

  update(tab) {
    const index = this.tabs.findIndex((ctab) => {
      return ctab.id === tab.id
    })

    if (index === -1) return

    if (tab.active) this.activeTabId = tab.id
    Object.assign(this.tabs[index], tab)
  }

  exists(tabId) {
    return this.tabs.some((tab) => {
      return tab.id === tabId
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

  updateTitle(title) {
    this.title = title
  }

  async delete() {
    const tabIds = this.tabs.map((tab) => {
      return tab.id
    })

    await browser.tabs.remove(tabIds)
  }

  async refresh() {
    const repo = new GroupRepository()

    for (let [index, tab] of this.tabs.entries()) {
      tab = await browser.tabs.get(tab.id)
      tab = await this.converter.convertTab(tab)

      Object.assign(this.tabs[index], tab)
    }
  }

  sortByIndex() {
    this.tabs = this.tabs.sort((tabA, tabB) => {
      return tabA.index - tabB.index
    })
  }
}
