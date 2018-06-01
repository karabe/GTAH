import Center from '../src/Center'

describe('Center', () => {
  let center

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

    center = new Center
  })

  describe('init', () => {
    test('main', async () => {
      const data = {}
      center.repo = {
        getAll: jest.fn().mockResolvedValueOnce(data)
      }
      center.converter = {
        convertTab: jest.fn()
      }

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

  describe('tabs listeners', () => {
    beforeEach(() => {
      center.repo = {
        save: jest.fn()
      }
    })

    afterEach(() => {
      expect(center.repo.save).toBeCalledWith(center.data)
    })

    test('created', async () => {
      const tab = {id: 1}
      center.data = {
        add: jest.fn()
      }
      center.converter = {
        convertTab: jest.fn().mockResolvedValueOnce(tab)
      }

      await center.listeners.created(tab)

      expect(center.data.add).toBeCalledWith(tab)
    })

    test('removed', () => {
      const tabId = 1
      center.data = {
        remove: jest.fn()
      }

      center.listeners.removed(tabId)

      expect(center.data.remove).toBeCalledWith(tabId)
    })

    test('updated', async () => {
      const tab = {id: 1}
      center.data = {
        update: jest.fn()
      }
      center.converter = {
        convertTab: jest.fn().mockResolvedValueOnce(tab)
      }

      await center.listeners.updated(tab.id, {}, tab)

      expect(center.data.update).toBeCalledWith(tab)
    })

    test('activated', async () => {
      const activeInfo = {tabId: 1}
      center.data = {
        activated: jest.fn()
      }

      await center.listeners.activated(activeInfo)

      expect(center.data.activated).toBeCalledWith(activeInfo.tabId)
    })

    test('moved', async () => {
      const tabId = 1
      center.data = {
        refresh: jest.fn()
      }

      await center.listeners.moved(tabId)

      expect(center.data.refresh).toBeCalledWith(tabId)
    })
  })
})
