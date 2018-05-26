import GroupData from './GroupData'
import Group from './Group'
import uuidv4 from 'uuid/v4';

export default class {
  async getAll() {
    const results = await browser.storage.local.get('data')

    if (results.data) {
      return new GroupData(results.data)
    }

    const groups = new GroupData()
    const tabs = await browser.tabs.query({currentWindow: true}),
          group = new Group()
    for (const tab of tabs) {
      group.add(await this.hydrate(tab))
    }
    groups.push(group)

    return groups
  }

  save(groups) {
    const conv = JSON.parse(JSON.stringify(groups))
    browser.storage.local.set({data: conv})
  }

  async hydrate(tab) {
    let uuid = await browser.sessions.getTabValue(tab.id, 'uuid')
    if (uuid === undefined) {
      uuid = uuidv4()
      await browser.sessions.setTabValue(tab.id, 'uuid', uuid)
    }

    return {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      uuid: uuid
    }
  }
}
