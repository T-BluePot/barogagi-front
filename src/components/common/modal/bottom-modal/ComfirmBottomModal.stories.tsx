import { ConfirmBottomModal } from "./ComfirmBottomModal";
import { BottomModalListButton } from "./BottomModalListButton";

export default {
  title: "Components/Common/Modal/Bottom Modal/ConfirmBottomModal",
  component: ConfirmBottomModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const BasicConfirm = {
  render: () => (
    <ConfirmBottomModal
      isOpen={true}
      title="기본 확인 모달"
      withDelete={false}
      onClose={() => console.log("modal closed")}
      onCancel={() => console.log("cancel clicked")}
      onConfirm={() => console.log("confirm clicked")}
    >
      <div className="p-6">
        <p className="text-gray-700 text-center">이 작업을 수행하시겠습니까?</p>
      </div>
    </ConfirmBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story: "기본적인 확인 모달입니다. 취소/확인 버튼만 있습니다.",
      },
    },
  },
};

export const WithDeleteButton = {
  render: () => (
    <ConfirmBottomModal
      isOpen={true}
      title="삭제 확인 모달"
      withDelete={true}
      onClose={() => console.log("modal closed")}
      onCancel={() => console.log("cancel clicked")}
      onConfirm={() => console.log("confirm clicked")}
      onDelete={() => console.log("delete clicked")}
    >
      <div className="p-6">
        <p className="text-gray-700 text-center">
          정말로 삭제하시겠습니까?
          <br />이 작업은 되돌릴 수 없습니다.
        </p>
      </div>
    </ConfirmBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story: "삭제 버튼이 포함된 확인 모달입니다.",
      },
    },
  },
};

export const WithListContent = {
  render: () => (
    <ConfirmBottomModal
      isOpen={true}
      title="옵션 선택"
      withDelete={false}
      onClose={() => console.log("modal closed")}
      onCancel={() => console.log("cancel clicked")}
      onConfirm={() => console.log("confirm clicked")}
    >
      <div>
        <BottomModalListButton
          label="옵션 1"
          isChecked={true}
          onClickChecked={() => console.log("옵션 1 선택")}
        />
        <BottomModalListButton
          label="옵션 2"
          isChecked={false}
          onClickChecked={() => console.log("옵션 2 선택")}
        />
        <BottomModalListButton
          label="옵션 3"
          isChecked={false}
          onClickChecked={() => console.log("옵션 3 선택")}
        />
      </div>
    </ConfirmBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story: "리스트 버튼들이 포함된 확인 모달입니다.",
      },
    },
  },
};

export const Interactive = {
  render: () => (
    <ConfirmBottomModal
      isOpen={true}
      title="인터랙티브 모달"
      withDelete={true}
      onClose={() => alert("모달이 닫혔습니다!")}
      onCancel={() => alert("취소되었습니다!")}
      onConfirm={() => alert("확인되었습니다!")}
      onDelete={() => alert("삭제되었습니다!")}
    >
      <div className="p-6">
        <p className="text-gray-700 text-center mb-4">버튼들을 클릭해보세요!</p>
        <div className="bg-yellow-100 p-3 rounded text-sm text-yellow-800">
          💡 버튼을 클릭하면 실제 액션이 실행됩니다.
        </div>
      </div>
    </ConfirmBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "실제 액션이 있는 인터랙티브 모달입니다. 각 버튼을 클릭해보세요.",
      },
    },
  },
};
