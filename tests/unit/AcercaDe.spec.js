import { shallowMount } from '@vue/test-utils'
import AcercaDe from '@/views/AcercaDe.vue'

describe('AcercaDe.vue', () => {
  it('imprime la vista acerca de', () => {
    const msg = ''
    const wrapper = shallowMount(AcercaDe, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch("Tortugas en el tiempo")
  })
})