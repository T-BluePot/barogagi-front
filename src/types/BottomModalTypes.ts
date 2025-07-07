import type { ReactNode } from "react";

/* 바텀 시트 레이아웃 **/
export interface BottomModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/* 바텀 시트 헤더 **/
type BottomModalHeaderVariant = "title" | "actions" | "detail";

export interface BottomModalHeaderProps {
  variant: BottomModalHeaderVariant;
  title: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

/* 기본 바텀 시트 **/
export type CommonBottomModalProps = BottomModalLayoutProps &
  Pick<BottomModalHeaderProps, "title" | "onCancel" | "onConfirm">;
