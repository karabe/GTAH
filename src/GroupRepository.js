import PopupData from './PopupData'
import Converter from './Converter'

export default class {
  constructor() {
    this.converter = new Converter
  }

  async getAll() {
    const results = await browser.storage.local.get('data')

    if (results.data) {
      return new PopupData(results.data)
    }

    const data = new PopupData()
    const tabs = await browser.tabs.query({currentWindow: true})
    for (const tab of tabs) {
      data.add(await this.converter.convertTab(tab))
    }

    return data
  }

  save(data) {
    const plain = JSON.parse(JSON.stringify(data))
    browser.storage.local.set({data: plain})
  }
}
