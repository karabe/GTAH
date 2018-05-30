import { mount } from '@vue/test-utils'
import MainVue from '../src/Main.vue'

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

    MainVue.created = () => {}
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

      expect(global.browser.runtime.sendMessage).toBeCalledWith({method: 'addNewGroup'})
    })
  })
})
