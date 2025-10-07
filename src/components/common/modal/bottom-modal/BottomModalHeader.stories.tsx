import { BottomModalHeader } from "./BottomModalHeader";

export default {
  title: "Components/Common/Modal/Bottom Modal/BottomModalHeader",
  component: BottomModalHeader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "바텀 모달의 헤더 컴포넌트입니다. variant에 따라 다른 UI를 제공합니다.",
      },
    },
  },
  tags: ["autodocs"],
};

export const TitleOnly = {
  render: () => <BottomModalHeader variant="title" title="제목만 있는 헤더" />,
  parameters: {
    docs: {
      description: {
        story:
          "제목만 표시되는 헤더입니다. 취소/확인 버튼은 표시되지 않습니다.",
      },
    },
  },
};

export const WithActions = {
  render: () => (
    <BottomModalHeader
      variant="actions"
      title="액션 헤더"
      onCancel={() => console.log("cancel clicked")}
      onConfirm={() => console.log("confirm clicked")}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "취소/확인 버튼이 있는 액션 헤더입니다.",
      },
    },
  },
};

export const DetailView = {
  render: () => (
    <BottomModalHeader
      variant="detail"
      title="상세 보기 헤더"
      onCancel={() => console.log("cancel clicked")}
      onConfirm={() => console.log("confirm clicked")}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "상세 보기용 헤더입니다. actions와 동일한 UI를 제공합니다.",
      },
    },
  },
};

export const LongTitle = {
  render: () => (
    <BottomModalHeader
      variant="title"
      title="아주 긴 제목이 들어가는 경우의 헤더 표시 상태를 확인하는 예시"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "긴 제목이 있는 경우의 헤더 표시 상태입니다.",
      },
    },
  },
};

export const Interactive = {
  render: () => (
    <BottomModalHeader
      variant="actions"
      title="인터랙티브 헤더"
      onCancel={() => alert("취소되었습니다!")}
      onConfirm={() => alert("확인되었습니다!")}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "실제 액션이 있는 인터랙티브 헤더입니다. 버튼을 클릭해보세요.",
      },
    },
  },
};
