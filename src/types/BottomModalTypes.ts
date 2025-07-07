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
  Pick<BottomModalHeaderProps, "title">;

export type ConfirmBottomModalProps =
  // ① 삭제 기능이 있는 경우 → onDelete 필수
  | (BottomModalLayoutProps &
      Pick<BottomModalHeaderProps, "title" | "onCancel" | "onConfirm"> & {
        withDelete: true;
        onDelete: () => void;
      })
  // ② 삭제 기능이 없는 경우 → onDelete 사용 불가
  | (BottomModalLayoutProps &
      Pick<BottomModalHeaderProps, "title" | "onCancel" | "onConfirm"> & {
        withDelete?: false; // false 또는 아예 전달 안 함
        onDelete?: never;
      });
