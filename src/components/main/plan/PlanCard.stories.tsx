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
    isDeleteMode: {
      control: "boolean",
      description: "삭제 모드 여부 (true: 쓰레기통, false: 드래그 핸들)",
    },
    onDelete: { action: "deleted" },
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

// 기본 상태 (시간/장소 미입력)
export const Default: Story = {
  args: {
    data: {
      id: 1,
      emoji: "🥓",
      title: "브런치",
    },
    isDeleteMode: false,
  },
};

// 시간/장소 입력된 상태
export const WithTimeAndLocation: Story = {
  args: {
    data: {
      id: 2,
      emoji: "🥓",
      title: "브런치",
      startTime: "10:00",
      endTime: "11:30",
      location: "부천시",
    },
    isDeleteMode: false,
  },
};

// 삭제 모드
export const DeleteMode: Story = {
  args: {
    data: {
      id: 3,
      emoji: "🥓",
      title: "브런치",
      startTime: "10:00",
      endTime: "11:30",
      location: "부천시",
    },
    isDeleteMode: true,
  },
};

// 시간만 입력된 상태
export const WithTimeOnly: Story = {
  args: {
    data: {
      id: 4,
      emoji: "☕",
      title: "카페",
      startTime: "14:00",
      endTime: "15:30",
    },
    isDeleteMode: false,
  },
};

// 장소만 입력된 상태
export const WithLocationOnly: Story = {
  args: {
    data: {
      id: 5,
      emoji: "🍜",
      title: "점심",
      location: "서울시 강남구",
    },
    isDeleteMode: false,
  },
};
