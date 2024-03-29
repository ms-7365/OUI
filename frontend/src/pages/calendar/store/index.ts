import { create } from 'zustand'

const useStore = create<Model>(( set ) => ({
  isModalOpened: false,
  updateModal: () => set(( state ) => ({ isModalOpened: !state.isModalOpened })),

  clickDate: new Date,
  updateDate: ( date ) => set(() => ({ clickDate: date })),
  
  modalContent: false,
  setModalContent: () => set(( state ) => ({ modalContent: !state.modalContent}))
}))

export interface Model{
  isModalOpened : boolean
  updateModal: () => void

  clickDate: Date
  updateDate: ( date: Date ) => void

  modalContent: boolean
  setModalContent: () => void
}
 
export default useStore;