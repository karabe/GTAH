import Converter from './Converter'
import uuidv4 from 'uuid/v4'

export default class {
  static get parentId() {
    return 'moveToAnotherGroup'
  }

  static get parentTitle() {
    return 'Move to another group'
  }

  constructor(group = {}) {
    this.title = group.title || 'Default'
    this.tabs = group.tabs || []
    this.activeTabId = group.activeTabId || null
    this.uuid = uuidv4()

    this.converter = new Converter
  }

  async add(tab) {
    this.tabs.push(await this.converter.convertTab(tab))
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

  async update(tab) {
    const index = this.tabs.findIndex((ctab) => {
      return ctab.id === tab.id
    })

    if (index === -1) return

    Object.assign(this.tabs[index], await this.converter.convertTab(tab))
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

  sortByIndex() {
    this.tabs = this.tabs.sort((tabA, tabB) => {
      return tabA.index - tabB.index
    })
  }

  async addNewTab() {
    const tab = await browser.tabs.create({active: false})
    await browser.tabs.hide(tab.id)
    await this.add(tab)
  }

  splice(tabId) {
    const index = this.tabs.findIndex((tab) => {
      return tab.id === tabId
    })

    const tabs = this.tabs.splice(index, 1)
    return tabs[0]
  }
}
