import type { Meta, StoryObj } from "@storybook/react-vite";
import PlanFormModal from "./PlanFormModal";

const meta: Meta<typeof PlanFormModal> = {
  title: "Components/Main/Plan/Modal/PlanFormModal",
  component: PlanFormModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    action: {
      description: "모달 상호 작용 관련 props",
    },
    info: {
      description: "모달에 표시할 정보 관련 props",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {
    action: {
      isOpen: true,
      onClickEditTitle: () => alert("제목 수정 클릭"),
      onClose: () => alert("모달 닫기"),
      onConfirm: () => alert("모달 확인"),
    },
    info: {
      mode: "Create",
      planNm: "여행 일정",
      startTime: "10:00",
      endTime: "12:00",
      address: "서울특별시 강남구",
      onClickTime: () => alert("시간 클릭"),
      onClickAddress: () => alert("주소 클릭"),
      tags: ["여행", "친구"],
      onClickTags: () => alert("태그 클릭"),
    },
  },
};

export const Edit: Story = {
  args: {
    action: {
      isOpen: true,
      onClickEditTitle: () => alert("제목 수정 클릭"),
      onClose: () => alert("모달 닫기"),
      onConfirm: () => alert("모달 확인"),
    },
    info: {
      mode: "Edit",
      planNm: "여행 일정",
      startTime: "10:00",
      endTime: "12:00",
      address: "서울특별시 강남구",
      onClickTime: () => alert("시간 클릭"),
      onClickAddress: () => alert("주소 클릭"),
      note: "",
      noteValue: "",
      onChangeNote: (e) => alert(`메모 변경: ${e}`),
    },
  },
};
