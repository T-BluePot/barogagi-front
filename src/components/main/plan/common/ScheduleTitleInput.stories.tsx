import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import ScheduleTitleInput from "./ScheduleTitleInput";

const meta = {
  title: "Components/Main/Plan/ScheduleTitleInput",
  component: ScheduleTitleInput,
  tags: ["autodocs"],
} satisfies Meta<typeof ScheduleTitleInput>;

export default meta;
type Story = StoryObj<typeof ScheduleTitleInput>;

export const Default: Story = {
  args: {
    scheduleName: "여행 일정",
  },

  render: (args) => {
    const [scheduleName, setScheduleName] = useState(args.scheduleName);
    return (
      <ScheduleTitleInput
        {...args}
        scheduleName={scheduleName}
        setScheduleName={setScheduleName}
      />
    );
  },
};
