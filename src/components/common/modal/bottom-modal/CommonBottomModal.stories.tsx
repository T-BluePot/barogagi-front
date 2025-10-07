import { CommonBottomModal } from "./CommonBottomModal";
import { BottomModalListButton } from "./BottomModalListButton";

export default {
  title: "Components/Common/Modal/Bottom Modal/CommonBottomModal",
  component: CommonBottomModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const BasicModal = {
  render: () => (
    <CommonBottomModal
      isOpen={true}
      title="기본 바텀 모달"
      onClose={() => console.log("modal closed")}
    >
      <div className="p-6">
        <p className="text-gray-700 text-center">
          기본적인 바텀 모달입니다. 제목만 표시됩니다.
        </p>
      </div>
    </CommonBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "기본적인 바텀 모달입니다. 제목만 표시되고 액션 버튼은 없습니다.",
      },
    },
  },
};

export const WithListContent = {
  render: () => (
    <CommonBottomModal
      isOpen={true}
      title="옵션 선택"
      onClose={() => console.log("modal closed")}
    >
      <div>
        <BottomModalListButton
          label="첫 번째 옵션"
          isChecked={true}
          onClickChecked={() => console.log("첫 번째 옵션 선택")}
        />
        <BottomModalListButton
          label="두 번째 옵션"
          isChecked={false}
          onClickChecked={() => console.log("두 번째 옵션 선택")}
        />
        <BottomModalListButton
          label="세 번째 옵션"
          isChecked={false}
          onClickChecked={() => console.log("세 번째 옵션 선택")}
        />
        <BottomModalListButton
          label="네 번째 옵션"
          isChecked={false}
          onClickChecked={() => console.log("네 번째 옵션 선택")}
        />
      </div>
    </CommonBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "리스트 버튼들이 포함된 바텀 모달입니다. 여러 옵션 중 선택할 수 있습니다.",
      },
    },
  },
};

export const WithRichContent = {
  render: () => (
    <CommonBottomModal
      isOpen={true}
      title="상세 정보"
      onClose={() => console.log("modal closed")}
    >
      <div className="p-6 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-2">알림</h4>
          <p className="text-blue-700 text-sm">
            이것은 다양한 컨텐츠가 포함된 바텀 모달의 예시입니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">기능 목록</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span>기능 1</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span>기능 2</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span>기능 3</span>
            </li>
          </ul>
        </div>
      </div>
    </CommonBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story: "다양한 리치 컨텐츠가 포함된 바텀 모달입니다.",
      },
    },
  },
};

export const LongTitle = {
  render: () => (
    <CommonBottomModal
      isOpen={true}
      title="아주 긴 제목이 들어가는 경우의 바텀 모달 표시 상태를 확인하는 예시"
      onClose={() => console.log("modal closed")}
    >
      <div className="p-6">
        <p className="text-gray-700 text-center">
          긴 제목이 어떻게 표시되는지 확인할 수 있습니다.
        </p>
      </div>
    </CommonBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story: "긴 제목이 있는 경우의 바텀 모달입니다.",
      },
    },
  },
};

export const Interactive = {
  render: () => (
    <CommonBottomModal
      isOpen={true}
      title="인터랙티브 모달"
      onClose={() => alert("모달이 닫혔습니다!")}
    >
      <div className="p-6">
        <p className="text-gray-700 text-center mb-4">
          배경을 클릭하거나 ESC 키를 눌러 모달을 닫아보세요!
        </p>
        <div className="bg-green-100 p-3 rounded text-sm text-green-800">
          💡 onClose 함수가 실행되어 알림이 표시됩니다.
        </div>
      </div>
    </CommonBottomModal>
  ),
  parameters: {
    docs: {
      description: {
        story: "실제 닫기 액션이 있는 인터랙티브 바텀 모달입니다.",
      },
    },
  },
};
