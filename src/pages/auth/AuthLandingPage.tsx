import { useState } from "react";
import CommonAlertModal from "@/components/modal/CommonAlertModal";
import CommonConfirmModal from "@/components/modal/CommonConfirmModal"; // CommonConfirmModal 임포트

const AuthLandingPage = () => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false); // Alert 모달 상태
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Confirm 모달 상태 추가

  // Alert 모달 열기
  const handleOpenAlertModal = () => {
    setIsAlertModalOpen(true);
  };

  // Alert 모달 닫기 (애니메이션 시작)
  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  // Confirm 모달 열기
  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  // Confirm 모달 닫기 (애니메이션 시작)
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  // Confirm 모달에서 '확인' 클릭 시 실행될 함수
  const handleConfirmAction = () => {
    console.log("확인 액션 실행됨!");
    handleCloseConfirmModal(); // 액션 실행 후 모달 닫기
  };

  // Confirm 모달에서 '취소' 클릭 시 실행될 함수 (또는 배경 클릭)
  const handleCancelAction = () => {
    console.log("취소 액션 실행됨!");
    handleCloseConfirmModal(); // 액션 실행 후 모달 닫기
  };

  const alertModalContent = {
    title: "스크롤 테스트 - 알림 모달",
    content: `이것은 모달의 최대 높이와 스크롤 기능을 테스트하기 위한 긴 내용입니다.

1. 모달의 최대 높이는 뷰포트 높이의 80%로 제한됩니다.
2. 내용이 이 높이를 초과하면 자동으로 스크롤이 활성화됩니다.
3. 버튼 영역은 항상 하단에 고정되어 있습니다.

다음은 추가적인 텍스트 내용입니다:

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

이제 스크롤이 제대로 작동하는지 확인해보세요!`,
  }; // Alert 모달 내용

  const confirmModalContent = {
    title: "스크롤 테스트 - 확인 모달",
    content: `이것은 확인 모달에서 긴 내용과 스크롤 기능을 테스트하기 위한 내용입니다.

정말로 다음 작업을 진행하시겠습니까?

작업 세부사항:
• 모든 데이터가 영구적으로 삭제됩니다
• 복구가 불가능합니다
• 관련된 모든 설정이 초기화됩니다
• 연결된 계정들의 연동이 해제됩니다

주의사항:
1. 이 작업은 되돌릴 수 없습니다
2. 백업이 필요한 데이터가 있다면 미리 저장해주세요
3. 작업 완료까지 약 5-10분이 소요될 수 있습니다
4. 작업 중에는 다른 기능을 사용할 수 없습니다

추가 정보:
- 처리 완료 후 이메일로 알림을 받게 됩니다
- 고객센터를 통해 추가 지원을 받을 수 있습니다
- 관련 정책은 이용약관을 참고해주세요

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

계속 진행하시겠습니까?`,
  }; // Confirm 모달 내용

  // Alert 모달 버튼 정보
  const alertButtonInfo = {
    label: "확인",
    onClick: handleCloseAlertModal,
  };

  // Confirm 모달 확인 버튼 정보
  const confirmButtonInfo = {
    label: "진행",
    onClick: handleConfirmAction,
  };

  // Confirm 모달 취소 버튼 정보
  const cancelButtonInfo = {
    label: "취소",
    onClick: handleCancelAction,
  };

  return (
    <div>
      {/* 여기에 로그인 페이지의 내용을 추가하세요 */}
      <h1>로그인 페이지</h1>
      <p>여기에 로그인 폼이나 관련 내용을 추가할 수 있습니다.</p>
      <button onClick={handleOpenAlertModal}>알림 모달 열기</button>{" "}
      {/* Alert 모달 버튼 */}
      <button onClick={handleOpenConfirmModal} style={{ marginLeft: "10px" }}>
        확인 모달 열기
      </button>{" "}
      {/* Confirm 모달 버튼 */}
      {/* Alert 모달 */}
      <CommonAlertModal
        isOpen={isAlertModalOpen}
        modalContent={alertModalContent}
        buttonInfo={alertButtonInfo}
      />
      {/* Confirm 모달 */}
      <CommonConfirmModal
        isOpen={isConfirmModalOpen}
        modalContent={confirmModalContent}
        confirmButtonInfo={confirmButtonInfo}
        cancelButtonInfo={cancelButtonInfo}
      />
    </div>
  );
};

export default AuthLandingPage;
