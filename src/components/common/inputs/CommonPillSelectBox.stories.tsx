import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import CommonPillSelectBox from "./CommonPillSelectBox";

const REGIONS = ["서울", "부산", "제주", "경기"];

const meta: Meta<typeof CommonPillSelectBox> = {
  title: "Components/Common/Inputs/CommonPillSelectBox",
  component: CommonPillSelectBox,
  tags: ["autodocs"],
  args: {
    value: "서울",
    options: REGIONS,
    ariaLabel: "지역 선택",
    onChange: (next: string) => console.log("Selected:", next),
  },
  argTypes: {
    tone: { control: "radio", options: ["light", "onPeach"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 흰 배경 위 (피치 라이트 톤) */
export const Light: Story = {
  args: { tone: "light" },
};

/** 피치 카드 위 (반투명 화이트 톤) — 배경 데코레이터로 가시성 확보 */
export const OnPeach: Story = {
  args: { tone: "onPeach" },
  decorators: [
    (Story) => (
      <div className="inline-block rounded-2xl bg-peach p-6">
        <Story />
      </div>
    ),
  ],
};

// 선택이 실제 반영되는 인터랙티브 데모 (hooks 규칙 준수를 위해 별도 컴포넌트로 분리)
const InteractiveDemo = (args: React.ComponentProps<typeof CommonPillSelectBox>) => {
  const [value, setValue] = useState(args.value);
  return <CommonPillSelectBox {...args} value={value} onChange={setValue} />;
};

/** 선택하면 값이 바뀌는 동작 예시 */
export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};
