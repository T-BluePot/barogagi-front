import { FullScreenModal } from "./FullScreenModal";

export default {
  title: "Components/Modal/FullScreenModal",
  component: FullScreenModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const DefaultModal = {
  render: () => (
    <FullScreenModal
      isOpen={true}
      onClose={() => console.log("onClose")}
      onButtonClick={() => console.log("onButtonClick")}
      title="기본 모달"
      content="이것은 기본 전체 화면 모달입니다."
      buttonLabel="확인"
    />
  ),
};

export const WithHighlight = {
  render: () => (
    <FullScreenModal
      isOpen={true}
      onClose={() => console.log("onClose")}
      onButtonClick={() => console.log("onButtonClick")}
      title="회원가입 완료"
      content="바로가기 서비스에 성공적으로 가입되었습니다"
      highlightText="user@example.com"
      buttonLabel="시작하기"
    />
  ),
};
