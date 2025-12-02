import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomModalDeleteButton } from "./BottomModalDeleteButton";

const meta: Meta<typeof BottomModalDeleteButton> = {
  title: "Components/Modal/Bottom Modal/BottomModalDeleteButton",
  component: BottomModalDeleteButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "바텀 모달에서 사용되는 삭제 버튼 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: {
      description: "삭제 버튼 클릭 시 호출되는 함수",
      action: "clicked",
    },
  },
  args: {
    onClick: () => console.log("delete button clicked"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: "삭제 버튼의 기본 상태입니다. 클릭하면 액션이 로그됩니다.",
      },
    },
  },
};

export const WithCustomAction: Story = {
  args: {
    onClick: () => {
      console.log("delete button clicked");
      alert("삭제되었습니다!");
    },
  },
  parameters: {
    docs: {
      description: {
        story: "커스텀 액션이 있는 삭제 버튼입니다. 클릭 시 알림이 표시됩니다.",
      },
    },
  },
};
