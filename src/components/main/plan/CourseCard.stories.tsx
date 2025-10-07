import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { CourseCard } from "./CourseCard";

const meta = {
  title: "Components/Main/Plan/CourseCard",
  component: CourseCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#111827",
        },
      ],
    },
  },
  tags: ["autodocs"],
  args: {
    onEdit: action("onEdit"),
    onDelete: action("onDelete"),
  },
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scheduleNum: 1,
    userNum: 101,
    date: "2025-05-05",
    scheduleTitle: "부산 여행",
    tags: ["이색체험", "맛집"],
    onEdit: action("onEdit"),
    onDelete: action("onDelete"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const LongTitle: Story = {
  args: {
    scheduleNum: 2,
    userNum: 101,
    date: "2025-06-15",
    scheduleTitle:
      "매우 긴 제목을 가진 일정입니다. 이 제목은 여러 줄에 걸쳐 표시될 수 있습니다.",
    tags: ["휴식", "자연", "힐링", "사진촬영"],
    onEdit: action("onEdit"),
    onDelete: action("onDelete"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const ManyTags: Story = {
  args: {
    scheduleNum: 3,
    userNum: 101,
    date: "2025-07-20",
    scheduleTitle: "전국 맛집 투어",
    tags: [
      "맛집",
      "이색체험",
      "휴식",
      "자연",
      "힐링",
      "사진촬영",
      "쇼핑",
      "문화",
    ],
    onEdit: action("onEdit"),
    onDelete: action("onDelete"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const SingleTag: Story = {
  args: {
    scheduleNum: 4,
    userNum: 101,
    date: "2025-08-10",
    scheduleTitle: "간단한 일정",
    tags: ["휴식"],
    onEdit: action("onEdit"),
    onDelete: action("onDelete"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const NoTags: Story = {
  args: {
    scheduleNum: 5,
    userNum: 101,
    date: "2025-09-01",
    scheduleTitle: "태그가 없는 일정",
    tags: [],
    onEdit: action("onEdit"),
    onDelete: action("onDelete"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const Multiple: Story = {
  args: {
    scheduleNum: 1,
    userNum: 101,
    date: "2025-05-05",
    scheduleTitle: "부산 여행",
    tags: ["이색체험", "맛집"],
    onEdit: action("onEdit"),
    onDelete: action("onDelete"),
  },
  render: (args) => (
    <div className="w-96 p-4 space-y-4">
      <CourseCard {...args} />
      <CourseCard
        {...args}
        scheduleNum={2}
        date="2025-06-15"
        scheduleTitle="서울 데이트 코스"
        tags={["로맨틱", "카페", "쇼핑"]}
      />
      <CourseCard
        {...args}
        scheduleNum={3}
        date="2025-07-20"
        scheduleTitle="제주도 힐링 여행"
        tags={["자연", "힐링", "사진촬영"]}
      />
    </div>
  ),
};
