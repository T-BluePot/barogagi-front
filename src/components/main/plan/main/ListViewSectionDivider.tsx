const ListViewSectionDivider = () => {
  return (
    <div className="flex w-full justify-center items-center flex-row gap-4">
      <hr className="flex-1 h-[1px] bg-gray-60" />
      <p className="typo-body text-gray-60">지난 일정</p>
      <hr className="flex-1 h-[1px] bg-gray-60" />
    </div>
  );
};

export default ListViewSectionDivider;
