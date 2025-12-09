import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScheduleCard } from "./ScheduleCard";

import { mockSchedules } from "@/mock/schedules";
import type { Schedule } from "@/types/scheduleTypes";

const meta: Meta<typeof ScheduleCard> = {
  title: "Components/Main/Plan/Main/ScheduleCard",
  component: ScheduleCard,
  parameters: {
    layout: "centered",
  },
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
    isDeleteDisabled: {
      control: "boolean",
      description: "삭제 버튼 비활성화 여부",
    },
    isPast: {
      control: "boolean",
      description:
        "지난 일정 여부에 따라 카드 스타일을 분기할 때 사용하는 플래그",
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
    isDeleteDisabled: false,
    isPast: false,
  },
};

export const PastSchedule: Story = {
  args: {
    schedule: mockSchedules[1] as Schedule,
    onClickCard: () => {
      console.log("카드 클릭");
    },
    onDelete: () => {
      console.log("삭제 클릭");
    },
    isDeleteDisabled: false,
    isPast: true,
  },
};

export const DeleteDisabled: Story = {
  args: {
    schedule: mockSchedules[2] as Schedule,
    onClickCard: () => {
      console.log("카드 클릭");
    },
    onDelete: () => {
      console.log("삭제 클릭");
    },
    isDeleteDisabled: true,
    isPast: false,
  },
};
