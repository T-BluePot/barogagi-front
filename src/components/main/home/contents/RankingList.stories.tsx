import type { Meta, StoryObj } from "@storybook/react-vite";
import RankingList from "./RankingList";

const meta = {
  title: "Components/Main/Home/RankingList",
  component: RankingList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "순위 목록을 롤링 애니메이션으로 표시하는 컴포넌트입니다. Framer Motion을 사용한 부드러운 전환 효과가 포함되어 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    rankings: {
      control: "object",
      description: "랭킹 데이터 배열",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
    rollInterval: {
      control: { type: "number", min: 1000, max: 10000, step: 500 },
      description: "롤링 간격 (밀리초) - 현재는 수동 제어만 가능",
    },
  },
} satisfies Meta<typeof RankingList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 목 데이터
const mockRankings = [
  { rank: 1, name: "성수", rankChange: "up" as const },
  { rank: 2, name: "홍대", rankChange: "same" as const },
  { rank: 3, name: "강남", rankChange: "up" as const },
  { rank: 4, name: "이태원", rankChange: "down" as const },
  { rank: 5, name: "명동", rankChange: "up" as const },
];

export const Default: Story = {
  args: {
    rankings: mockRankings,
  },
};

export const SingleItem: Story = {
  args: {
    rankings: [{ rank: 1, name: "성수", rankChange: "up" }],
  },
};

export const TwoItems: Story = {
  args: {
    rankings: [
      { rank: 1, name: "성수", rankChange: "up" },
      { rank: 2, name: "홍대", rankChange: "down" },
    ],
  },
};

export const WithoutRankChange: Story = {
  args: {
    rankings: [
      { rank: 1, name: "성수" },
      { rank: 2, name: "홍대" },
      { rank: 3, name: "강남" },
    ],
  },
};

export const LongNames: Story = {
  args: {
    rankings: [
      { rank: 1, name: "매우 긴 지역명이 있는 경우", rankChange: "up" },
      { rank: 2, name: "또 다른 긴 이름의 장소", rankChange: "down" },
      { rank: 3, name: "짧은 이름", rankChange: "same" },
    ],
  },
};

export const AllRankChangeTypes: Story = {
  args: {
    rankings: [
      { rank: 1, name: "상승", rankChange: "up" },
      { rank: 2, name: "하락", rankChange: "down" },
      { rank: 3, name: "동일", rankChange: "same" },
      { rank: 4, name: "변동없음" },
    ],
  },
};

export const EmptyList: Story = {
  args: {
    rankings: [],
  },
};
