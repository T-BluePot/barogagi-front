import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CommonConfirmModal from "./CommonConfirmModal";

const meta = {
  title: "Components/Modal/Common Modal/CommonConfirmModal",
  component: CommonConfirmModal,
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
    confirmButtonInfo: {
      control: "object",
    },
    cancelButtonInfo: {
      control: "object",
    },
  },
} satisfies Meta<typeof CommonConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "확인",
      content: "정말로 이 작업을 수행하시겠습니까?",
    },
    confirmButtonInfo: {
      label: "확인",
      onClick: () => console.log("confirmClick"),
    },
    cancelButtonInfo: {
      label: "취소",
      onClick: () => console.log("cancelClick"),
    },
  },
};

export const DeleteConfirm: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "삭제 확인",
      content: "선택한 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    },
    confirmButtonInfo: {
      label: "삭제",
      onClick: () => console.log("deleteClick"),
    },
    cancelButtonInfo: {
      label: "취소",
      onClick: () => console.log("cancelClick"),
    },
  },
};

export const SaveConfirm: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "저장 확인",
      content: "변경사항을 저장하시겠습니까?",
    },
    confirmButtonInfo: {
      label: "저장",
      onClick: () => console.log("saveClick"),
    },
    cancelButtonInfo: {
      label: "저장 안함",
      onClick: () => console.log("dontSaveClick"),
    },
  },
};

export const LogoutConfirm: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "로그아웃",
      content: "정말로 로그아웃 하시겠습니까?",
    },
    confirmButtonInfo: {
      label: "로그아웃",
      onClick: () => console.log("logoutClick"),
    },
    cancelButtonInfo: {
      label: "계속 사용",
      onClick: () => console.log("stayClick"),
    },
  },
};

export const LongContent: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "중요한 알림",
      content:
        "이 작업을 수행하면 다음과 같은 변경사항이 적용됩니다:\n\n1. 기존 데이터가 모두 삭제됩니다\n2. 새로운 설정이 적용됩니다\n3. 이 과정은 되돌릴 수 없습니다\n\n정말로 계속 진행하시겠습니까?",
    },
    confirmButtonInfo: {
      label: "진행",
      onClick: () => console.log("proceedClick"),
    },
    cancelButtonInfo: {
      label: "취소",
      onClick: () => console.log("cancelClick"),
    },
  },
};

export const CustomLabels: Story = {
  args: {
    isOpen: true,
    modalContent: {
      title: "업데이트 확인",
      content: "새로운 버전으로 업데이트하시겠습니까?",
    },
    confirmButtonInfo: {
      label: "지금 업데이트",
      onClick: () => console.log("updateNowClick"),
    },
    cancelButtonInfo: {
      label: "나중에",
      onClick: () => console.log("updateLaterClick"),
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    isOpen: false,
    modalContent: {
      title: "인터랙티브 모달",
      content: "확인 또는 취소를 선택해보세요.",
    },
    confirmButtonInfo: {
      label: "확인",
      onClick: () => console.log("confirmClick"),
    },
    cancelButtonInfo: {
      label: "취소",
      onClick: () => console.log("cancelClick"),
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [result, setResult] = useState<string>("");

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
        >
          모달 열기
        </button>

        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <strong>결과:</strong> {result}
          </div>
        )}

        <CommonConfirmModal
          {...args}
          isOpen={isOpen}
          confirmButtonInfo={{
            ...args.confirmButtonInfo,
            onClick: () => {
              setIsOpen(false);
              setResult("확인 버튼을 클릭했습니다.");
              console.log("confirmClick");
            },
          }}
          cancelButtonInfo={{
            ...args.cancelButtonInfo,
            onClick: () => {
              setIsOpen(false);
              setResult("취소 버튼을 클릭했습니다.");
              console.log("cancelClick");
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
    confirmButtonInfo: {
      label: "확인",
      onClick: () => console.log("confirmClick"),
    },
    cancelButtonInfo: {
      label: "취소",
      onClick: () => console.log("cancelClick"),
    },
  },
};
