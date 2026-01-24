import { create } from "zustand";

interface ConfirmModalContent {
  title: string;
  content?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  modalContent: ConfirmModalContent | null;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;

  // 확인 모달 열기
  openConfirmModal: (
    content: ConfirmModalContent,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
  // 확인 모달 닫기 (취소)
  closeConfirmModal: () => void;
  // 확인 버튼 클릭
  confirmModal: () => void;
}

export const useConfirmModalStore = create<ConfirmModalState>((set, get) => ({
  isOpen: false,
  modalContent: null,
  onConfirm: null,
  onCancel: null,

  openConfirmModal: (content, onConfirm, onCancel) =>
    set({
      isOpen: true,
      modalContent: content,
      onConfirm,
      onCancel: onCancel ?? null,
    }),

  closeConfirmModal: () => {
    const { onCancel } = get();
    onCancel?.();
    set({
      isOpen: false,
      modalContent: null,
      onConfirm: null,
      onCancel: null,
    });
  },

  confirmModal: () => {
    const { onConfirm } = get();
    onConfirm?.();
    set({
      isOpen: false,
      modalContent: null,
      onConfirm: null,
      onCancel: null,
    });
  },
}));
