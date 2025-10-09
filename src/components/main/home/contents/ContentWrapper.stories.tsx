import type { Meta, StoryObj } from "@storybook/react-vite";
import ContentWrapper from "./ContentWrapper";

const meta = {
  title: "Components/Main/Home/ContentWrapper",
  component: ContentWrapper,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "제목과 하이라이트 텍스트를 가진 섹션 컨테이너 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "기본 제목 텍스트",
    },
    highlightText: {
      control: "text",
      description: "강조할 텍스트 (선택사항)",
    },
    children: {
      control: false,
      description: "래핑할 자식 컨텐츠",
    },
  },
} satisfies Meta<typeof ContentWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "기본 제목",
    children: (
      <div className="bg-gray-10 p-4 rounded">여기에 콘텐츠가 들어갑니다</div>
    ),
  },
};

export const WithHighlight: Story = {
  args: {
    title: "지금 인기 있는",
    highlightText: "일정",
    children: <div className="bg-gray-10 p-4 rounded">트렌딩 콘텐츠</div>,
  },
};

export const LongTitle: Story = {
  args: {
    title: "아주 긴 제목이 있는 경우에는 어떻게 표시되는지",
    highlightText: "확인해보세요",
    children: <div className="bg-gray-10 p-4 rounded">긴 제목 테스트</div>,
  },
};

export const OnlyTitle: Story = {
  args: {
    title: "하이라이트 없는 제목만",
    children: <div className="bg-gray-10 p-4 rounded">단순한 제목</div>,
  },
};

export const WithComplexContent: Story = {
  args: {
    title: "복잡한 콘텐츠",
    highlightText: "예시",
    children: (
      <div className="space-y-4">
        <div className="bg-main p-3 rounded">첫 번째 아이템</div>
        <div className="bg-gray-10 p-3 rounded">두 번째 아이템</div>
        <div className="bg-main-disable p-3 rounded">세 번째 아이템</div>
      </div>
    ),
  },
};
