import type { ReactNode } from "react";

interface CommonModalContentProps {
  title: string;
  /** 한 문단짜리 본문. `children` 을 넘기면 무시된다 */
  content?: string;
  /**
   * 문단 대신 넣을 본문 (확인 사항 목록 등).
   * 제목 규격을 공유하려고 여기로 받는다 — 호출부에서 h1 을 직접 그리면
   * 타이포·여백이 모달마다 어긋난다.
   */
  children?: ReactNode;
}

const CommonModalContent = ({
  title,
  content,
  children,
}: CommonModalContentProps) => {
  return (
    <div className="mx-4">
      <h1 className="typo-subtitle text-gray-black pb-3 pt-4 ">{title}</h1>
      {children ?? (
        <p className="typo-caption text-gray-50 pb-3 whitespace-pre-line">
          {content}
        </p>
      )}
    </div>
  );
};

export default CommonModalContent;
