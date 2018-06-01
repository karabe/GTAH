import PopupData from './PopupData'
import uuidv4 from 'uuid/v4'

export default class {
  async getAll() {
    const results = await browser.storage.local.get('data')

    if (results.data) {
      return new PopupData(results.data)
    }

    const data = new PopupData()
    const tabs = await browser.tabs.query({currentWindow: true})
    for (const tab of tabs) {
      data.add(await this.hydrate(tab))
    }

    return data
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
      index: tab.index,
      active: tab.active,
      title: tab.title,
      url: tab.url,
      uuid: uuid
    }
  }
}
