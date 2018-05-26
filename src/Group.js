import uuidv4 from 'uuid/v4';

export default class {
  constructor(group = {}) {
    this.title = group.title || 'Default'
    this.tabs = group.tabs || []
    this.uuid = group.uuid || uuidv4()
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
  }

  addTabs(tabs) {
    tabs.forEach((tab) => {
      this.add(tab)
    })
  }
}
