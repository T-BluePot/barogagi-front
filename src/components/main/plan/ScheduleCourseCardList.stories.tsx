import type { Meta, StoryObj } from "@storybook/react-vite";
import ScheduleCourseCardList from "./ScheduleCourseCardList";
import type { ScheduleCourseData } from "./ScheduleCourseCard";

const mockItems: ScheduleCourseData[] = [
  {
    id: 1,
    emoji: "🥓",
    title: "브런치",
    startTime: "10:00",
    endTime: "11:30",
    location: "부천시",
  },
  {
    id: 2,
    emoji: "☕",
    title: "카페",
    startTime: "12:00",
    endTime: "13:00",
  },
  {
    id: 3,
    emoji: "🎬",
    title: "영화",
    startTime: "14:00",
    endTime: "16:30",
    location: "CGV 부천",
  },
  {
    id: 4,
    emoji: "🍜",
    title: "저녁",
    location: "서울시 강남구",
  },
];

const meta = {
  title: "Components/Main/Plan/ScheduleCourseCardList",
  component: ScheduleCourseCardList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isDeleteMode: {
      control: "boolean",
      description: "삭제 모드 여부",
    },
    onOrderChange: { action: "order changed" },
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
} satisfies Meta<typeof ScheduleCourseCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 (드래그 모드)
export const Default: Story = {
  args: {
    items: mockItems,
    isDeleteMode: false,
  },
};

// 삭제 모드
export const DeleteMode: Story = {
  args: {
    items: mockItems,
    isDeleteMode: true,
  },
};

// 빈 리스트
export const EmptyList: Story = {
  args: {
    items: [],
    isDeleteMode: false,
  },
};

// 단일 아이템
export const SingleItem: Story = {
  args: {
    items: [mockItems[0]],
    isDeleteMode: false,
  },
};
