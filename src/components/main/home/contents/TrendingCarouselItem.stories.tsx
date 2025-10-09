import type { Meta, StoryObj } from "@storybook/react-vite";
import TrendingCarouselItem from "./TrendingCarouselItem";

const meta = {
  title: "Components/Main/Home/TrendingCarouselItem",
  component: TrendingCarouselItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "원형 이미지 배경에 텍스트가 오버레이된 카드 컴포넌트입니다. 캐러셀이나 그리드에서 사용할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    item: {
      control: "object",
      description: "트렌딩 아이템 데이터",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
  },
} satisfies Meta<typeof TrendingCarouselItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cafe: Story = {
  args: {
    item: {
      id: 1,
      title: "분위기 좋은",
      subtitle: "카페",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
    },
  },
};

export const Date: Story = {
  args: {
    item: {
      id: 2,
      title: "낭만적인",
      subtitle: "데이트",
      imageUrl:
        "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=400&h=400&fit=crop&crop=center",
    },
  },
};

export const Restaurant: Story = {
  args: {
    item: {
      id: 3,
      title: "맛있는",
      subtitle: "맛집",
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&crop=center",
    },
  },
};

export const Travel: Story = {
  args: {
    item: {
      id: 4,
      title: "힐링되는",
      subtitle: "여행",
      imageUrl:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop&crop=center",
    },
  },
};

export const Activity: Story = {
  args: {
    item: {
      id: 5,
      title: "즐거운",
      subtitle: "액티비티",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop&crop=center",
    },
  },
};

export const LongText: Story = {
  args: {
    item: {
      id: 6,
      title: "매우 긴 타이틀이 있는",
      subtitle: "긴 서브타이틀",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
    },
  },
};

export const ShortText: Story = {
  args: {
    item: {
      id: 7,
      title: "짧은",
      subtitle: "글",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
    },
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <TrendingCarouselItem
        item={{
          id: 1,
          title: "분위기 좋은",
          subtitle: "카페",
          imageUrl:
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
        }}
      />
      <TrendingCarouselItem
        item={{
          id: 2,
          title: "낭만적인",
          subtitle: "데이트",
          imageUrl:
            "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=400&h=400&fit=crop&crop=center",
        }}
      />
      <TrendingCarouselItem
        item={{
          id: 3,
          title: "맛있는",
          subtitle: "맛집",
          imageUrl:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&crop=center",
        }}
      />
    </div>
  ),
};
