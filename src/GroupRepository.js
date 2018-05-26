import GroupArray from './GroupArray'
import Group from './Group'

export default class {
  async getAll() {
    const results = await browser.storage.local.get('groups')

    if (results.groups) {
      return this.hydrate(results.groups)
    }

    const groups = new GroupArray()
    const tabs = await browser.tabs.query({currentWindow: true}),
          group = new Group()
    group.addTabs(tabs)
    groups.push(group)

    return groups
  }

  save(groups) {
    const conv = JSON.parse(JSON.stringify(groups))
    browser.storage.local.set({groups: conv})
  }

  hydrate(groups) {
    const groupArray = new GroupArray
    groups.forEach((group) => {
      groupArray.push(new Group(group))
    })
    return groupArray
  }
}
