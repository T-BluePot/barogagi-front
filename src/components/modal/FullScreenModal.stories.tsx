import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { FullScreenModal } from "./FullScreenModal";

const meta = {
  title: "Components/Modal/FullScreenModal",
  component: FullScreenModal,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#111827",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
    content: {
      control: "text",
    },
    buttonLabel: {
      control: "text",
    },
    highlightText: {
      control: "text",
    },
  },
  args: {
    onClose: action("onClose"),
    onButtonClick: action("onButtonClick"),
  },
} satisfies Meta<typeof FullScreenModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: "안내",
    content: "전체 화면 모달입니다.",
    buttonLabel: "확인",
    onClose: action("onClose"),
    onButtonClick: action("onButtonClick"),
  },
};

export const Welcome: Story = {
  args: {
    isOpen: true,
    title: "환영합니다!",
    content: "바로가기 앱에 오신 것을 환영합니다. 다양한 기능을 사용해보세요.",
    buttonLabel: "시작하기",
    highlightText: "시작하기",
    onClose: action("onClose"),
    onButtonClick: action("startClick"),
  },
};

export const Terms: Story = {
  args: {
    isOpen: true,
    title: "이용약관",
    content:
      "서비스 이용약관을 확인해주세요.\n\n제1조 (목적)\n본 약관은 회사가 제공하는 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n본 약관에서 사용하는 용어의 정의는 다음과 같습니다.",
    buttonLabel: "동의하고 계속",
    highlightText: "동의",
    onClose: action("onClose"),
    onButtonClick: action("agreeClick"),
  },
};

export const Tutorial: Story = {
  args: {
    isOpen: true,
    title: "튜토리얼",
    content:
      "앱 사용법을 안내해드립니다.\n\n1. 메인 화면에서 원하는 기능을 선택하세요\n2. 상세 설정을 진행하세요\n3. 완료 버튼을 눌러 저장하세요",
    buttonLabel: "튜토리얼 시작",
    highlightText: "튜토리얼",
    onClose: action("onClose"),
    onButtonClick: action("tutorialStart"),
  },
};

export const Update: Story = {
  args: {
    isOpen: true,
    title: "업데이트 안내",
    content:
      "새로운 기능이 추가되었습니다!\n\n• 향상된 사용자 인터페이스\n• 새로운 테마 옵션\n• 성능 개선\n• 버그 수정",
    buttonLabel: "새로운 기능 보기",
    highlightText: "새로운 기능",
    onClose: action("onClose"),
    onButtonClick: action("viewFeatures"),
  },
};

export const LongContent: Story = {
  args: {
    isOpen: true,
    title: "상세 정보",
    content:
      "매우 긴 내용입니다. 이 내용은 여러 줄에 걸쳐 표시되며 스크롤이 필요할 수 있습니다.\n\n전체 화면 모달의 레이아웃이 긴 내용을 어떻게 처리하는지 확인할 수 있습니다.\n\n추가 내용을 더 넣어서 스크롤 동작을 테스트해봅시다.\n\n1. 첫 번째 항목\n2. 두 번째 항목\n3. 세 번째 항목\n4. 네 번째 항목\n5. 다섯 번째 항목\n\n이와 같이 많은 내용이 있을 때도 모달이 올바르게 동작해야 합니다.",
    buttonLabel: "이해했습니다",
    onClose: action("onClose"),
    onButtonClick: action("understand"),
  },
};

export const NoButton: Story = {
  args: {
    isOpen: true,
    title: "정보",
    content: "버튼이 없는 모달입니다. 닫기는 X 버튼으로만 가능합니다.",
    onClose: action("onClose"),
  },
};

export const InteractiveDemo: Story = {
  args: {
    isOpen: false,
    title: "인터랙티브 모달",
    content: "이 모달은 인터랙티브하게 동작합니다.",
    buttonLabel: "완료",
    onClose: action("onClose"),
    onButtonClick: action("onButtonClick"),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
        >
          풀스크린 모달 열기
        </button>

        <div className="mt-4">
          <p>버튼 클릭 횟수: {clickCount}</p>
        </div>

        <FullScreenModal
          {...args}
          isOpen={isOpen}
          content={`이 모달에서 버튼을 클릭한 횟수: ${clickCount}번\n\n버튼을 클릭하거나 X를 눌러 모달을 닫을 수 있습니다.`}
          onClose={() => {
            setIsOpen(false);
            action("onClose")();
          }}
          onButtonClick={() => {
            setClickCount((prev) => prev + 1);
            setIsOpen(false);
            action("onButtonClick")();
          }}
        />
      </div>
    );
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    title: "닫힌 모달",
    content: "이 모달은 닫혀있습니다.",
    buttonLabel: "확인",
    onClose: action("onClose"),
    onButtonClick: action("onButtonClick"),
  },
};
