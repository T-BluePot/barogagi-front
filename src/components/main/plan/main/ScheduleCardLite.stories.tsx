import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScheduleCardLite } from "./ScheduleCardLite";

import { mockSchedules } from "@/mock/schedules";
import type { Schedule } from "@/types/scheduleTypes";

const meta: Meta<typeof ScheduleCardLite> = {
  title: "Components/Main/Plan/Main/ScheduleCardLite",
  component: ScheduleCardLite,
  argTypes: {
    schedule: {
      control: false,
      description: "리스트에 표시할 일정",
    },
    onClickCard: {
      action: "onClickCard",
      description: "카드를 클릭했을 때 호출되는 콜백",
    },
    onDelete: {
      action: "onDelete",
      description: "삭제 버튼 클릭 시 호출되는 콜백",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    schedule: mockSchedules[0] as Schedule,
    onClickCard: () => {
      console.log("카드 클릭");
    },
    onDelete: () => {
      console.log("삭제 클릭");
    },
  },
};
