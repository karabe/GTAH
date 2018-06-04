import GroupRepository from '../src/GroupRepository'
import PopupData from '../src/PopupData'

describe('GroupRepository', () => {
  let repo

  beforeEach(() => {
    global.browser = {
      storage: {
        local: {
          get: jest.fn(),
          set: jest.fn()
        }
      },
      tabs: {
        query: jest.fn()
      },
      sessions: {
        getTabValue: jest.fn(),
        setTabValue: jest.fn()
      }
    }

    repo = new GroupRepository
  })

  describe('getAll', () => {
    test('data exists', async () => {
      browser.storage.local.get.mockReturnValueOnce({
        data: {
          groups: [{
            title: 'Test'
          }],
          currentIndex: 0
        }
      })
      const data = await repo.getAll()
      expect(data).toBeInstanceOf(PopupData)
    })

    test('data not exists', async () => {
      const tab = {id: 1}
      browser.storage.local.get.mockResolvedValueOnce({})
      browser.tabs.query.mockResolvedValueOnce([tab])
      repo.converter = {
        convertTab: jest.fn().mockResolvedValueOnce(tab)
      }

      const data = await repo.getAll()

      expect(browser.tabs.query).toBeCalledWith({currentWindow: true})
      expect(repo.converter.convertTab).toBeCalledWith(tab)
      expect(data).toBeInstanceOf(PopupData)
      expect(data.groups).toHaveLength(1)
      expect(data.groups[0].tabs[0].id).toBe(1)
    })
  })

  describe('save', () => {
    test('main', () => {
      repo.save({
        groups: [],
        func() {
        }
      })

      expect(browser.storage.local.set).toBeCalledWith({data: {groups: []}})
    })
  })
})
