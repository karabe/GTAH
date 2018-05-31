import Center from '../src/Center'

describe('Center', () => {
  let center, repo
  const data = {
    add: jest.fn()
  }

  beforeEach(() => {
    global.browser = {
      tabs: {
        onCreated: {
          addListener: jest.fn(),
          removeListener: jest.fn()
        },
        onRemoved: {
          addListener: jest.fn(),
          removeListener: jest.fn()
        },
        onUpdated: {
          addListener: jest.fn()
        },
        onActivated: {
          addListener: jest.fn(),
          removeListener: jest.fn()
        },
        onMoved: {
          addListener: jest.fn()
        }
      },
      runtime: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    }

    repo = {
      async getAll() {
        return data
      },
      async hydrate(tab) {
        return tab
      },
      save: jest.fn()
    }

    center = new Center(repo)
  })

  describe('init', () => {
    test('main', async () => {
      await center.init()

      expect(center.data).toBe(data)
    })
  })

  describe('addListeners', () => {
    test('main', () => {
      center.addListeners()

      expect(browser.tabs.onCreated.addListener).toBeCalledWith(center.listeners.created)
      expect(browser.tabs.onRemoved.addListener).toBeCalledWith(center.listeners.removed)
      expect(browser.tabs.onUpdated.addListener).toBeCalledWith(center.listeners.updated)
      expect(browser.tabs.onActivated.addListener).toBeCalledWith(center.listeners.activated)
      expect(browser.tabs.onMoved.addListener).toBeCalledWith(center.listeners.moved)
      expect(browser.runtime.onMessage.addListener).toBeCalledWith(center.listeners.message)
    })
  })

  describe('listeners.created', () => {
    test('main', async () => {
      const tab = {}

      await center.init()
      await center.listeners.created(tab)

      expect(data.add).toBeCalledWith(tab)
      expect(repo.save).toBeCalledWith(data)
    })
  })
})
