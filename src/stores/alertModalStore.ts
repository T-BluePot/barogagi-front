import { create } from "zustand";

interface AlertModalContent {
  title: string;
  content?: string;
  buttonLabel?: string;
}

interface AlertModalState {
  isOpen: boolean;
  modalContent: AlertModalContent | null;
  onClose: (() => void) | null;

  // 알림 모달 열기
  openAlertModal: (content: AlertModalContent, onClose?: () => void) => void;
  // 알림 모달 닫기
  closeAlertModal: () => void;
}

export const useAlertModalStore = create<AlertModalState>((set) => ({
  isOpen: false,
  modalContent: null,
  onClose: null,

  openAlertModal: (content, onClose) =>
    set({
      isOpen: true,
      modalContent: content,
      onClose: onClose ?? null,
    }),

  closeAlertModal: () =>
    set((state) => {
      // onClose 콜백 실행
      state.onClose?.();
      return {
        isOpen: false,
        modalContent: null,
        onClose: null,
      };
    }),
}));
