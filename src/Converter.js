import uuidv4 from 'uuid/v4'

export default class {
  async convertTab(tab) {
    let uuid = await browser.sessions.getTabValue(tab.id, 'uuid')
    if (uuid === undefined) {
      uuid = uuidv4()
      await browser.sessions.setTabValue(tab.id, 'uuid', uuid)
    }

    return {
      id: tab.id,
      index: tab.index,
      active: tab.active,
      title: tab.title,
      url: tab.url,
      uuid: uuid
    }
  }
}
