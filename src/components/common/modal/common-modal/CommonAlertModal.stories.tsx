import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import CommonAlertModal from "./CommonAlertModal";

const meta = {
  title: "Components/Modal/Common Modal/CommonAlertModal",
  component: CommonAlertModal,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#111827",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
    },
    modalContent: {
      control: "object",
    },
    buttonInfo: {
      control: "object",
    },
  },
} satisfies Meta<typeof CommonAlertModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "알림",
      content: "작업이 완료되었습니다.",
    },
    buttonInfo: {
      label: "확인",
      onClick: action("buttonClick"),
    },
  },
};

export const LongContent: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "알림",
      content:
        "매우 긴 내용입니다. 이 내용은 여러 줄에 걸쳐 표시될 수 있으며, 모달의 레이아웃이 올바르게 동작하는지 확인하기 위해 작성되었습니다. 모달의 크기가 내용에 따라 적절히 조정되는지 확인할 수 있습니다.",
    },
    buttonInfo: {
      label: "확인",
      onClick: action("buttonClick"),
    },
  },
};

export const ErrorAlert: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "오류",
      content: "요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.",
    },
    buttonInfo: {
      label: "다시 시도",
      onClick: action("retryClick"),
    },
  },
};

export const SuccessAlert: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "성공",
      content: "파일이 성공적으로 업로드되었습니다.",
    },
    buttonInfo: {
      label: "완료",
      onClick: action("completeClick"),
    },
  },
};

export const WarningAlert: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "경고",
      content: "이 작업을 계속하면 데이터가 손실될 수 있습니다.",
    },
    buttonInfo: {
      label: "이해했습니다",
      onClick: action("acknowledgeClick"),
    },
  },
};

export const CustomButtonLabel: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "업데이트 알림",
      content: "새로운 버전이 출시되었습니다. 지금 업데이트하시겠습니까?",
    },
    buttonInfo: {
      label: "나중에 하기",
      onClick: action("postponeClick"),
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    isOpen: false,
    modalContent: {
      title: "인터랙티브 모달",
      content: "버튼을 클릭해서 모달을 열고 닫아보세요.",
    },
    buttonInfo: {
      label: "닫기",
      onClick: action("closeClick"),
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          모달 열기
        </button>

        <CommonAlertModal
          {...args}
          isOpen={isOpen}
          buttonInfo={{
            ...args.buttonInfo,
            onClick: () => {
              setIsOpen(false);
              action("closeClick")();
            },
          }}
        />
      </div>
    );
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    modalContent: {
      title: "닫힌 모달",
      content: "이 모달은 닫혀있습니다.",
    },
    buttonInfo: {
      label: "확인",
      onClick: action("buttonClick"),
    },
  },
};
