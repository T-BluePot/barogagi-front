import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScheduleList } from "./ScheduleList";
import type { Schedule } from "@/types/scheduleTypes";

import { mockSchedules, pastMockSchedules } from "@/mock/schedules";

const meta: Meta<typeof ScheduleList> = {
  title: "Components/Main/Plan/Main/ScheduleList", // Storybook 좌측 네비게이션에 표시될 그룹/이름
  component: ScheduleList,
  parameters: {
    // 리스트 전체를 화면 폭에 맞게 보기 위해 fullscreen 레이아웃 사용
    layout: "fullscreen",
  },
  argTypes: {
    isPast: {
      control: "boolean",
      description:
        "지난 일정 여부에 따라 카드 스타일을 분기할 때 사용하는 플래그",
    },
    schedules: {
      control: false,
      description: "리스트에 표시할 일정 배열(Schedule[])",
    },
    onClickCard: {
      action: "onClickCard",
      description: "카드를 클릭했을 때 호출되는 콜백(상위 라우팅/상세 이동 등)",
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
    isPast: false,
    schedules: mockSchedules as Schedule[],
    onClickCard: (scheduleNum: number) => {
      console.log("카드 클릭:", scheduleNum);
    },
    onDelete: (scheduleNum: number) => {
      console.log("삭제 클릭:", scheduleNum);
    },
  },
};

export const PastSchedules: Story = {
  args: {
    isPast: true,
    schedules: pastMockSchedules as Schedule[],
    onClickCard: (scheduleNum: number) => {
      console.log("카드 클릭:", scheduleNum);
    },
    onDelete: (scheduleNum: number) => {
      console.log("삭제 클릭:", scheduleNum);
    },
  },
};
