import { mount } from '@vue/test-utils'
import MainVue from '../src/Main.vue'
import GroupRepository from '../src/GroupRepository'

const mockGetAll = jest.fn()
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
      expect(browser.storage.onChanged.addListener).toBeCalled()
      expect(wrapper.vm.data).toBe(mockData)
    })
  })

  describe('isActive', () => {
    test('main', () => {
      const recieved = wrapper.vm.isActive(0)

      expect(recieved).toBeTruthy()
    })
  })
})
