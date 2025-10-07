import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomModalListButton } from "./BottomModalListButton";

const meta: Meta<typeof BottomModalListButton> = {
  title: "Components/Common/Modal/Bottom Modal/BottomModalListButton",
  component: BottomModalListButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "바텀 모달에서 사용되는 리스트 버튼 컴포넌트입니다. 체크 상태를 표시할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "버튼에 표시될 텍스트",
    },
    isChecked: {
      control: "boolean",
      description: "체크 상태",
    },
    onClickChecked: {
      description: "버튼 클릭 시 호출되는 함수",
      action: "clicked",
    },
  },
  args: {
    onClickChecked: () => console.log("list button clicked"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    label: "선택되지 않은 항목",
    isChecked: false,
  },
  parameters: {
    docs: {
      description: {
        story: "체크되지 않은 상태의 리스트 버튼입니다.",
      },
    },
  },
};

export const Checked: Story = {
  args: {
    label: "선택된 항목",
    isChecked: true,
  },
  parameters: {
    docs: {
      description: {
        story: "체크된 상태의 리스트 버튼입니다. 체크 아이콘이 표시됩니다.",
      },
    },
  },
};

export const LongLabel: Story = {
  args: {
    label:
      "아주 긴 텍스트가 들어가는 경우의 리스트 버튼 표시 상태를 확인하는 예시",
    isChecked: false,
  },
  parameters: {
    docs: {
      description: {
        story: "긴 텍스트가 있는 경우의 리스트 버튼 표시 상태입니다.",
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    label: "클릭해보세요",
    isChecked: false,
    onClickChecked: () => alert("리스트 버튼이 클릭되었습니다!"),
  },
  parameters: {
    docs: {
      description: {
        story: "실제 액션이 있는 인터랙티브 리스트 버튼입니다.",
      },
    },
  },
};

export const MultipleItems: Story = {
  render: () => (
    <div className="w-80 border border-gray-200 rounded-lg overflow-hidden">
      <BottomModalListButton
        label="첫 번째 항목"
        isChecked={true}
        onClickChecked={() => console.log("첫 번째 항목 클릭")}
      />
      <BottomModalListButton
        label="두 번째 항목"
        isChecked={false}
        onClickChecked={() => console.log("두 번째 항목 클릭")}
      />
      <BottomModalListButton
        label="세 번째 항목"
        isChecked={false}
        onClickChecked={() => console.log("세 번째 항목 클릭")}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "여러 개의 리스트 버튼이 함께 사용되는 경우입니다.",
      },
    },
  },
};
