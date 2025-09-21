import FullScreenModalLayout from "../layout/FullScreenModalLayout";
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
  const handleButtonClick = () => {
    if (props.onButtonClick) {
      props.onButtonClick();
    } else {
      props.onClose(); // 기본값: 모달 닫기
    }
  };

  return (
    <FullScreenModalLayout onClose={handleButtonClick}>
      <FullScreenModalContent
        title={props.title}
        content={props.content}
        buttonLabel={props.buttonLabel}
        highlightText={props.highlightText}
        onButtonClick={handleButtonClick}
      />
    </FullScreenModalLayout>
  );
};
