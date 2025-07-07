export const BottomModalDeleteButton = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex h-14 items-center justify-center border-t border-gray-5"
    >
      <span className="typo-body text-alert-red">삭제하기</span>
    </button>
  );
};
