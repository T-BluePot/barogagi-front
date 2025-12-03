// ButtonWithText.stories.tsx
// ButtonWithText 컴포넌트용 Storybook 설정 파일입니다.

import type { Meta, StoryObj } from "@storybook/react-vite";
import ButtonWithText from "./ButtonWithText";
import type { ButtonProps } from "./CommonButton";
import IconBox from "@/components/common/IconBox";

// IconBox 타입 선언 확장
declare module "@/components/common/IconBox" {
  interface IconBoxProps {
    name: string;
    width?: number;
    height?: number;
    className?: string;
  }
}

// Storybook 메타 정보 설정
const meta: Meta<typeof ButtonWithText> = {
  title: "Components/Common/Buttons/ButtonWithText",
  component: ButtonWithText,
  tags: ["autodocs"],
  parameters: {
    layout: "center",
  },
};

export default meta;

// Story 타입 정의
type Story = StoryObj<typeof ButtonWithText>;

// 기본 형태: 텍스트 + 기본 버튼
export const Default: Story = {
  args: {
    textLabel: "텍스트 링크",
    // 텍스트 버튼 클릭 시 동작
    onClickText: () => {
      console.log("텍스트 링크 클릭");
    },
    // CommonButton 에 전달할 props
    button: {
      label: "기본 Button",
    } satisfies ButtonProps,
  },
};

// Icon 포함 버튼 예시
export const WithIconButton: Story = {
  args: {
    textLabel: "비밀번호를 잊으셨나요?",
    onClickText: () => {
      console.log("보조 텍스트 클릭");
    },
    button: {
      label: "Icon 포함 버튼",
      // CommonButton 이 icon: ReactNode 를 받는다는 가정하에 아이콘 전달
      icon: <IconBox name="home" width={24} height={24} />,
    } satisfies ButtonProps,
  },
};

// 버튼 비활성화 예시
export const DisabledButton: Story = {
  args: {
    textLabel: "텍스트만 활성화",
    onClickText: () => {
      console.log("텍스트 클릭");
    },
    button: {
      label: "Disabled Button",
      isDisabled: true,
    } satisfies ButtonProps,
  },
};
