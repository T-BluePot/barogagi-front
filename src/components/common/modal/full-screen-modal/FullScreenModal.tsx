import { useEffect, useState } from "react";
import FullScreenModalLayout from "@/components/layout/FullScreenModalLayout";
import FullScreenModalContent from "./FullScreenModalContent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onButtonClick?: () => void;
  title?: string;
  content?: string;
  buttonLabel?: string;
  highlightText?: string;
};

export const FullScreenModal = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (props.isOpen) {
      // isOpen이 true가 되면 다음 렌더링 사이클에 opacity 애니메이션 시작
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [props.isOpen]);

  if (!props.isOpen) {
    return null;
  }

  const handleButtonClick = () => {
    if (props.onButtonClick) {
      props.onButtonClick();
    } else {
      props.onClose(); // 기본값: 모달 닫기
    }
  };

  return (
    <div
      className={`transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <FullScreenModalLayout onClose={handleButtonClick}>
        <FullScreenModalContent
          title={props.title}
          content={props.content}
          buttonLabel={props.buttonLabel}
          highlightText={props.highlightText}
          onButtonClick={handleButtonClick}
        />
      </FullScreenModalLayout>
    </div>
  );
};
