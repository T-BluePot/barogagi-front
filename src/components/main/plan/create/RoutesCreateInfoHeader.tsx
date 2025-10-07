import EditIcon from "@mui/icons-material/Edit";
import { formatDate } from "@/utils/date";
import clsx from "clsx";

interface InfoHeaderProps {
  // 일정명 수정 모드
  editMode: boolean;
  setEditMode: (mode: boolean) => void;

  routeName: string; // 일정명
  setRouteName: (name: string) => void; // 일정명 변경 함수 (필요시 사용)
  routeDate: Date; // 일정 날짜
}

const RoutesCreateInfoHeader = ({
  routeName,
  setRouteName,
  routeDate,
  editMode,
  setEditMode,
}: InfoHeaderProps) => {
  const inputClass = `px-[2px] py-1 border-b border-gray-40 focus:outline-none`;
  const inputFontClass = `typo-title-01`;
  const inputPlaceholder = `placeholder:text-xl placeholder-gray-30`;

  return (
    <header>
      <div className="flex flex-col w-full items-baseline gap-2">
        {!editMode && (
          <button
            className="cursor-pointer"
            onClick={() => {
              setEditMode(true);
            }}
          >
            <div className="flex flex-row items-end gap-1 px-[2px] py-1">
              <span className="typo-title-01 ">{routeName}</span>
              <div>
                <EditIcon className="!text-[16px] text-gray-50" />
              </div>
            </div>
          </button>
        )}
        {editMode && (
          <div>
            <input
              type="text"
              className={clsx(inputClass, inputFontClass, inputPlaceholder)}
              placeholder="자유롭게 일정명을 입력해보세요!"
              value={routeName}
              onChange={(e) => {
                setRouteName(e.target.value);
              }}
              onBlur={() => {
                setEditMode(false);
              }}
              autoFocus
            />
          </div>
        )}
        <div className="flex flex-row w-full justify-between">
          <span className="typo-subtitle">{formatDate(routeDate)}</span>
        </div>
      </div>
    </header>
  );
};

export default RoutesCreateInfoHeader;
