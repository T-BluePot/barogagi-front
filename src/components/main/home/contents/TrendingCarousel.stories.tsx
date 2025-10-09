import type { Meta, StoryObj } from "@storybook/react-vite";
import TrendingCarousel from "./TrendingCarousel";

const meta = {
  title: "Components/Main/Home/TrendingCarousel",
  component: TrendingCarousel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "트렌딩 정보를 표시하는 수평 스크롤 가능한 캐러셀 컴포넌트입니다. Framer Motion 드래그 인터랙션을 지원합니다.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: {
      control: "object",
      description: "캐러셀에 표시할 아이템 배열 (비어있으면 목 데이터 사용)",
    },
  },
} satisfies Meta<typeof TrendingCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [],
  },
  parameters: {
    docs: {
      description: {
        story: "기본 트렌딩 캐러셀입니다. 목 데이터를 사용하여 표시됩니다.",
      },
    },
  },
};

export const WithCustomItems: Story = {
  args: {
    items: [
      {
        id: 1,
        title: "서울 맛집",
        subtitle: "투어",
        imageUrl: "/api/placeholder/120/120",
      },
      {
        id: 2,
        title: "부산 여행",
        subtitle: "가이드",
        imageUrl: "/api/placeholder/120/120",
      },
      {
        id: 3,
        title: "제주도",
        subtitle: "힐링",
        imageUrl: "/api/placeholder/120/120",
      },
      {
        id: 4,
        title: "강릉 카페",
        subtitle: "투어",
        imageUrl: "/api/placeholder/120/120",
      },
      {
        id: 5,
        title: "전주",
        subtitle: "한옥마을",
        imageUrl: "/api/placeholder/120/120",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "커스텀 아이템들로 구성된 캐러셀입니다. 드래그하여 스크롤할 수 있습니다.",
      },
    },
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        id: 1,
        title: "단일",
        subtitle: "아이템",
        imageUrl: "/api/placeholder/120/120",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "아이템이 하나만 있는 경우의 표시 방식입니다.",
      },
    },
  },
};

export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `아이템`,
      subtitle: `${i + 1}번째`,
      imageUrl: "/api/placeholder/120/120",
    })),
  },
  parameters: {
    docs: {
      description: {
        story:
          "많은 아이템이 있는 경우의 캐러셀입니다. 드래그 인터랙션을 통해 탐색할 수 있습니다.",
      },
    },
  },
};

export const WithLongText: Story = {
  args: {
    items: [
      {
        id: 1,
        title: "매우 긴 제목을 가진",
        subtitle: "트렌딩 아이템",
        imageUrl: "/api/placeholder/120/120",
      },
      {
        id: 2,
        title: "Short",
        subtitle: "Text",
        imageUrl: "/api/placeholder/120/120",
      },
      {
        id: 3,
        title: "또 다른 긴",
        subtitle: "제목 아이템",
        imageUrl: "/api/placeholder/120/120",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "긴 텍스트를 포함한 아이템들이 어떻게 표시되는지 확인할 수 있습니다.",
      },
    },
  },
};
