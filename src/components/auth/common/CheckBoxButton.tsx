import clsx from "clsx";

import CheckIcon from "@mui/icons-material/Check";

type GapSize = "default" | "tight";

interface CheckBoxButtonBase {
  size?: "default" | "large"; // 체크 아이콘 사이즈
  gap?: GapSize; // 체크 - 라벨 간 간격
  isChecked: boolean; // 체크 여부
  onCheckedChange?: () => void;
  labelColor?: "white" | "gray";
}

/**
 * 접근 가능한 이름을 **타입으로 강제**한다.
 * - 라벨을 넘기면 그 텍스트가 버튼의 이름이 된다 (`aria-label` 불필요)
 * - 라벨이 없으면 아이콘만 남으므로 `ariaLabel` 이 필수다
 *
 * 이렇게 두면 이름 없는 아이콘 버튼을 만들 수 없다 — 넘기지 않으면 컴파일이 막힌다.
 */
export type CheckBoxButtonProps = CheckBoxButtonBase &
  (
    | { label: string; ariaLabel?: never }
    | { label?: undefined; ariaLabel: string }
  );

export const CheckBoxButton = ({
  size = "default",
  gap = "default",
  isChecked,
  onCheckedChange,
  label,
  labelColor = "white",
  ariaLabel,
}: CheckBoxButtonProps) => {
  const gapClass = gap === "tight" ? "gap-2" : "gap-4";

  const iconSize = size === "large" ? 28 : 20; // px 단위
  const colorClass = isChecked ? "text-main" : "text-gray-30";

  const labelClass = clsx(
    "typo-body",
    labelColor === "white" && "text-gray-black",
    labelColor === "gray" && "text-gray-50"
  );

  return (
    // 라벨까지 버튼 안에 넣는다 — 밖에 두면 글자를 눌러도 토글되지 않고,
    // 버튼 이름과 글자가 따로 존재해 낭독기가 같은 말을 두 번 읽는다.
    //
    // div[role=button] 이었을 때는 Enter/Space 처리가 없어 키보드로 누를 수 없었다.
    // 실제 button 이면 키보드 동작·포커스 링을 브라우저가 알아서 해준다.
    // 체크 상태는 aria-pressed 로 알린다(아이콘 색만으로는 낭독기가 알 수 없다).
    <button
      type="button"
      onClick={onCheckedChange}
      aria-label={ariaLabel}
      aria-pressed={isChecked}
      className={clsx(
        "flex cursor-pointer flex-row items-center text-left",
        gapClass
      )}
    >
      <CheckIcon sx={{ fontSize: iconSize }} className={colorClass} />
      {label && <span className={labelClass}>{label}</span>}
    </button>
  );
};
