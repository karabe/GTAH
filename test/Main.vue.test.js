import { mount } from '@vue/test-utils'
import MainVue from '../src/Main.vue'

const mockData = {groups: [], currentIndex: 0}
jest.mock('../src/GroupRepository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      async getAll() {
        return mockData
      }
    }
  })
})

describe('MainVue', () => {
  let wrapper

  beforeEach(() => {
    global.browser = {
      runtime: {
        sendMessage: jest.fn()
      },
      storage: {
        onChanged: {
          addListener: jest.fn()
        }
      }
    }

    wrapper = mount(MainVue, {
      propsData: {
        data: {
          group: {
            title: 'Default',
            tabs: [{id: 1, title: 'Title'}]
          },
          index: 0,
          isActive: false
        }
      }
    })
  })

  describe('addNewGroup', () => {
    test('main', () => {
      wrapper.vm.addNewGroup()

      expect(browser.runtime.sendMessage).toBeCalledWith({method: 'addNewGroup'})
      expect(browser.storage.onChanged.addListener).toBeCalledWith(wrapper.vm.changed)
      expect(wrapper.vm.data).toBe(mockData)
    })
  })

  describe('isActive', () => {
    test('main', () => {
      const recieved = wrapper.vm.isActive(0)

      expect(recieved).toBeTruthy()
    })
  })

  describe('changed', () => {
    test('main', () => {
      const changes = {
        data: {
          newValue: {
            group: {
              title: 'Test',
              tabs: [{id: 1, title: 'TestTab'}]
            },
            index: 0,
            isActive: false
          }
        }
      }

      wrapper.vm.changed(changes)

      expect(wrapper.vm.data).toBe(changes.data.newValue)
    })
  })
})
