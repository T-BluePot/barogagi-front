import type { Meta, StoryObj } from "@storybook/react-vite";
import PlanCard from "./PlanCard";

const meta = {
  title: "Components/Main/Plan/PlanCard",
  component: PlanCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onDeleteClick: { action: "deleted" },
    onTimeClick: { action: "time clicked" },
    onLocationClick: { action: "location clicked" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "360px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlanCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태 (시간/장소 미입력) - 왼쪽으로 스와이프하여 삭제
export const Default: Story = {
  args: {
    data: {
      storeIndex: 0,
      id: 1,
      source: "USER_CUSTOM",
      emoji: "🥓",
      title: "브런치",
    },
  },
};

// 시간/장소 입력된 상태
export const WithTimeAndLocation: Story = {
  args: {
    data: {
      storeIndex: 1,
      id: 2,
      source: "USER_CUSTOM",
      emoji: "🥓",
      title: "브런치",
      startTime: "10:00",
      endTime: "11:30",
      location: "부천시",
    },
  },
};

// 시간만 입력된 상태
export const WithTimeOnly: Story = {
  args: {
    data: {
      storeIndex: 2,
      id: 4,
      source: "USER_CUSTOM",
      emoji: "☕",
      title: "카페",
      startTime: "14:00",
      endTime: "15:30",
    },
  },
};

// 장소만 입력된 상태
export const WithLocationOnly: Story = {
  args: {
    data: {
      storeIndex: 3,
      id: 5,
      source: "USER_CUSTOM",
      emoji: "🍜",
      title: "점심",
      location: "서울시 강남구",
    },
  },
};
