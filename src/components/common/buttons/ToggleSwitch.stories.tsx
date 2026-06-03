import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ToggleSwitch from "./ToggleSwitch";

const meta: Meta<typeof ToggleSwitch> = {
  title: "Components/Common/Buttons/ToggleSwitch",
  component: ToggleSwitch,
  tags: ["autodocs"],
  args: {
    ariaLabel: "알림 수신",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

/** 켜짐/꺼짐 상태를 직접 토글해볼 수 있는 인터랙티브 스토리 */
export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <ToggleSwitch {...args} checked={checked} onChange={setChecked} />;
  },
};

export const On: Story = {
  args: { checked: true, onChange: () => {} },
};

export const Off: Story = {
  args: { checked: false, onChange: () => {} },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true, onChange: () => {} },
};
