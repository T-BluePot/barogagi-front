import type { Meta, StoryObj } from "@storybook/react-vite";
import RankingItem from "./RankingItem";

const meta = {
  title: "Components/Main/Home/RankingItem",
  component: RankingItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "순위, 이름, 변동 상태를 표시하는 랭킹 아이템 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    item: {
      control: "object",
      description: "랭킹 아이템 데이터",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
  },
} satisfies Meta<typeof RankingItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RankUp: Story = {
  args: {
    item: {
      rank: 1,
      name: "성수",
      rankChange: "up",
    },
  },
};

export const RankDown: Story = {
  args: {
    item: {
      rank: 2,
      name: "홍대",
      rankChange: "down",
    },
  },
};

export const RankSame: Story = {
  args: {
    item: {
      rank: 3,
      name: "강남",
      rankChange: "same",
    },
  },
};

export const NoRankChange: Story = {
  args: {
    item: {
      rank: 4,
      name: "이태원",
    },
  },
};

export const LongName: Story = {
  args: {
    item: {
      rank: 5,
      name: "매우 긴 지역명이 있는 경우",
      rankChange: "up",
    },
  },
};

export const HighRank: Story = {
  args: {
    item: {
      rank: 99,
      name: "높은 순위",
      rankChange: "down",
    },
  },
};

export const AllVariants = {
  render: () => (
    <div className="space-y-3 bg-gray-10 p-4 rounded-lg">
      <RankingItem item={{ rank: 1, name: "1위 상승", rankChange: "up" }} />
      <RankingItem item={{ rank: 2, name: "2위 하락", rankChange: "down" }} />
      <RankingItem item={{ rank: 3, name: "3위 동일", rankChange: "same" }} />
      <RankingItem item={{ rank: 4, name: "4위 변동없음" }} />
    </div>
  ),
};
