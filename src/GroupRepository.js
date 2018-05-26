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

  save(data) {
    const plain = JSON.parse(JSON.stringify(data))
    browser.storage.local.set({data: plain})
  }

  async hydrate(tab) {
    let uuid = await browser.sessions.getTabValue(tab.id, 'uuid')
    if (uuid === undefined) {
      uuid = uuidv4()
      await browser.sessions.setTabValue(tab.id, 'uuid', uuid)
    }

    return {
      id: tab.id,
      active: tab.active,
      title: tab.title,
      url: tab.url,
      uuid: uuid
    }
  }
}
