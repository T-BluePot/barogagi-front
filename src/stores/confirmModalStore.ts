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
  // 확인 모달 닫기 전용 (배경 클릭/하드웨어 백 — onCancel 실행 안 함)
  closeConfirmModal: () => void;
  // 취소 버튼 클릭 (onCancel 실행 후 닫기)
  cancelModal: () => void;
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

  closeConfirmModal: () =>
    set({
      isOpen: false,
      modalContent: null,
      onConfirm: null,
      onCancel: null,
    }),

  cancelModal: () => {
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
