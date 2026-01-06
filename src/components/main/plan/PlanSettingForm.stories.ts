import type { Meta, StoryObj } from "@storybook/react-vite";

import { PlanSettingForm } from "./PlanSettingForm";
import type { PlanData } from "./PlanCard";

const mockItems: PlanData[] = [
  {
    id: "1",
    emoji: "🍜",
    title: "한강 라면",
    startTime: "11:30",
    endTime: "12:30",
    location: "서울시 종로구",
  },
  {
    id: "2",
    emoji: "☕",
    title: "카페 방문",
    startTime: "13:00",
    endTime: "14:00",
    location: "서울시 강남구",
  },
  {
    id: "3",
    emoji: "🎬",
    title: "영화 관람",
    startTime: "15:00",
    endTime: "17:30",
    location: "서울시 마포구",
  },
];

const meta = {
  title: "Components/Main/Plan/PlanSettingForm",
  component: PlanSettingForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    initialItems: {
      control: "object",
      description: "초기 일정 데이터 배열",
    },
  },
  args: {
    onAddPlan: () => {},
    onOrderChange: () => {},
    onDeleteClick: () => {},
    onTimeClick: () => {},
    onLocationClick: () => {},
  },
} satisfies Meta<typeof PlanSettingForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialItems: mockItems,
  },
};

export const Empty: Story = {
  args: {
    initialItems: [],
  },
};

export const SingleItem: Story = {
  args: {
    initialItems: [mockItems[0]],
  },
};

export const WithoutTimeAndLocation: Story = {
  args: {
    initialItems: [
      {
        id: "1",
        emoji: "📝",
        title: "메모만 있는 일정",
      },
      {
        id: "2",
        emoji: "🎯",
        title: "목표 설정",
      },
    ],
  },
};
