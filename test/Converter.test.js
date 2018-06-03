import Converter from '../src/Converter'

describe('Converter', () => {
  const converter = new Converter

  beforeEach(() => {
    global.browser = {
      sessions: {
        getTabValue: jest.fn(),
        setTabValue: jest.fn()
      }
    }
  })

  describe('convertTab', () => {
    let tab

    beforeEach(() => {
      tab = {
        id: 1,
        index: 1,
        active: false,
        title: 'title',
        url: 'http://example.com',
        uuid: 'uuid'
      }
    })

    test('uuid exists', async () => {
      const uuid = '51c1af0a-f9ff-4ae4-a042-a40667150567'
      browser.sessions.getTabValue.mockReturnValueOnce(uuid)

      const converted = await converter.convertTab(tab)

      expect(browser.sessions.getTabValue).toBeCalledWith(1, 'uuid')
      expect(converted.uuid).toBe(uuid)
    })

    test('uuid not exists', async () => {
      const converted = await converter.convertTab(tab)

      expect(browser.sessions.getTabValue).toBeCalledWith(1, 'uuid')
      expect(browser.sessions.setTabValue).toBeCalledWith(1, 'uuid', converted.uuid)
    })
  })
})
