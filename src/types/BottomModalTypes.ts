import type { ReactNode } from "react";

/* 바텀 시트 레이아웃 **/
export interface BottomModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/* 바텀 시트 헤더 **/
interface TitleHeaderProps {
  variant: "title";
  title: string;
  onCancel?: never; // "title"일 때는 받지 않음
  onConfirm?: never; // → 넘기면 타입 에러
}

interface DetailHeaderProps {
  variant: "actions" | "detail";
  title: string;
  onCancel: () => void; // 필수
  onConfirm: () => void; // 필수
}

export interface TitleWithActionHeaderProps {
  title: string;
  actionLabel: string;
  onClickAction: () => void;
}

// 두 인터페이스를 유니언으로 합쳐 최종 Props 완성
export type BottomModalHeaderProps = TitleHeaderProps | DetailHeaderProps;

/* 기본 바텀 시트 **/
export type CommonBottomModalProps = BottomModalLayoutProps &
  Omit<TitleHeaderProps, "variant">;

type ActionOrDetailHeaderCore = Omit<DetailHeaderProps, "variant">;

/* ConfirmBottomModal 전용 props */
type ConfirmBaseProps = BottomModalLayoutProps & ActionOrDetailHeaderCore;

export type ConfirmBottomModalProps =
  /* (1) 삭제 버튼 있는 경우 */
  | (ConfirmBaseProps & { withDelete: true; onDelete: () => void })
  /* (2) 삭제 버튼 없는 경우 */
  | (ConfirmBaseProps & { withDelete?: false; onDelete?: never });
