import GroupArray from './GroupArray'
import Group from './Group'

export default class {
  async getAll() {
    const results = await browser.storage.sync.get('groups')

    let groups = new GroupArray()
    if (results.groups) {
      results.groups.forEach((group) => {
        groups.push(new Group(group.title, group.tabs))
      })
    } else {
      const tabs = await browser.tabs.query({currentWindow: true}),
            group = new Group()
      group.addTabs(tabs)
      groups.push(group)
    }

    return groups
  }

  save(groups) {
    const conv = JSON.parse(JSON.stringify(groups))
    browser.storage.sync.set({groups: conv})
  }
}
