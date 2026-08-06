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
  /** 이름 미입력(placeholder "내 계획") 상태면 title을 회색 + 얇은 폰트로 표시 */
  titlePlaceholder?: boolean;
  actionLabel?: string;
  onClickAction?: () => void;
  /**
   * 제목 텍스트 자체를 눌렀을 때의 동작.
   *
   * 우측 액션 링크가 작아 잘 안 눌린다는 피드백으로 추가했다.
   * `onClickAction` 을 그대로 재사용하지 않는 이유: 액션이 항상 "제목 편집"인 건 아니다.
   * (예: SelectRegionBottomModal 의 액션은 "지역 변경" — 제목을 눌러 초기화되면 안 된다)
   * → 제목 편집이 맞는 모달만 이 prop 을 넘긴다.
   */
  onClickTitle?: () => void;
}

// 두 인터페이스를 유니언으로 합쳐 최종 Props 완성
export type BottomModalHeaderProps = TitleHeaderProps | DetailHeaderProps;

/* 기본 바텀 시트 **/
export type CommonBottomModalProps = BottomModalLayoutProps &
  Omit<TitleHeaderProps, "variant">;

export type ActionBottomModalProps = BottomModalLayoutProps &
  Omit<TitleWithActionHeaderProps, "variant">;

type ActionOrDetailHeaderCore = Omit<DetailHeaderProps, "variant">;

/* ConfirmBottomModal 전용 props */
type ConfirmBaseProps = BottomModalLayoutProps & ActionOrDetailHeaderCore;

export type ConfirmBottomModalProps =
  /* (1) 삭제 버튼 있는 경우 */
  | (ConfirmBaseProps & { withDelete: true; onDelete: () => void })
  /* (2) 삭제 버튼 없는 경우 */
  | (ConfirmBaseProps & { withDelete?: false; onDelete?: never });
