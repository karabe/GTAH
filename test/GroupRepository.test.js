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
          groups: [],
          currentIndex: 0
        }
      })
      const data = await repo.getAll()
      expect(data).toBeInstanceOf(PopupData)
    })

    test('data not exists', async () => {
      browser.storage.local.get.mockReturnValueOnce({})
      browser.tabs.query.mockReturnValueOnce([{id: 1}])
      repo.converter = {
        convertTab: jest.fn()
      }

      const data = await repo.getAll()

      expect(browser.tabs.query).toBeCalledWith({currentWindow: true})
      expect(repo.converter.convertTab).toBeCalledWith({id: 1})
      expect(data).toBeInstanceOf(PopupData)
      expect(data.groups).toHaveLength(1)
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
