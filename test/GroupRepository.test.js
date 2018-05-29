import GroupRepository from '../src/GroupRepository'
import GroupData from '../src/GroupData'

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
      expect(data).toBeInstanceOf(GroupData)
    })

    test('data not exists', async () => {
      browser.storage.local.get.mockReturnValueOnce({})
      browser.tabs.query.mockReturnValueOnce([{id: 1}])
      repo.hydrate = jest.fn()

      const data = await repo.getAll()

      expect(browser.tabs.query).toBeCalledWith({currentWindow: true})
      expect(repo.hydrate).toBeCalledWith({id: 1})
      expect(data).toBeInstanceOf(GroupData)
    })
  })

  describe('save', () => {
    test('main', () => {
      repo.save({
        groups: [],
        func() {
          console.info('func called')
        }
      })

      expect(browser.storage.local.set).toBeCalledWith({data: {groups: []}})
    })
  })

  describe('hydrate', () => {
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

      const hydrated = await repo.hydrate(tab)

      expect(browser.sessions.getTabValue).toBeCalledWith(1, 'uuid')
      expect(hydrated.uuid).toBe(uuid)
    })

    test('uuid not exists', async () => {
      const hydrated = await repo.hydrate(tab)

      expect(browser.sessions.getTabValue).toBeCalledWith(1, 'uuid')
      expect(browser.sessions.setTabValue).toBeCalledWith(1, 'uuid', hydrated.uuid)
    })
  })
})
