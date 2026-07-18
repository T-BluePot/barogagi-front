import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

// 휠에 처음 보여줄 표시용 기본값(현재년도 2026이 아니라 생일로 무난한 2000년).
// 주의: 이 값은 "화면 표시용"일 뿐 사용자가 휠을 조작하기 전엔 부모(저장값)로 커밋하지 않는다.
const DEFAULT_BIRTH_YEAR = "2000";
const DEFAULT_BIRTH_MONTH = "01";
const DEFAULT_BIRTH_DAY = "01";

// react-mobile-picker의 value는 Record<string,string> 형태를 요구하므로 인덱스 시그니처를 포함한다.
interface PickerValue {
  year: string;
  month: string;
  day: string;
  [key: string]: string;
}

export interface BirthdayPickerProps {
  userBirthYear: string;
  userBirthMonth: string;
  userBirthDay: string;
  onChange: (value: {
    userBirthYear: string;
    userBirthMonth: string;
    userBirthDay: string;
  }) => void;
}

export const BirthdayPicker = ({
  userBirthYear,
  userBirthMonth,
  userBirthDay,
  onChange,
}: BirthdayPickerProps) => {
  // 표시용 내부 상태. 부모 값이 있으면 그 값을, 없으면 기본값을 보여준다.
  // 휠은 빈 값을 표시할 수 없어 표시용 값은 항상 채워 두되, 저장값(부모)은 조작 시에만 커밋한다.
  const [display, setDisplay] = useState<PickerValue>({
    year: userBirthYear || DEFAULT_BIRTH_YEAR,
    month: userBirthMonth || DEFAULT_BIRTH_MONTH,
    day: userBirthDay || DEFAULT_BIRTH_DAY,
  });
  const [days, setDays] = useState<string[]>([]);

  // 부모 값이 채워지거나 바뀌면(수정 화면의 비동기 로드 등) 표시도 동기화한다.
  useEffect(() => {
    if (userBirthYear && userBirthMonth && userBirthDay) {
      setDisplay({
        year: userBirthYear,
        month: userBirthMonth,
        day: userBirthDay,
      });
    }
  }, [userBirthYear, userBirthMonth, userBirthDay]);

  // 표시값(연·월) 기준으로 일수 계산 → 일 컬럼이 항상 채워지도록 한다.
  useEffect(() => {
    const lastDay = new Date(
      Number(display.year),
      Number(display.month),
      0
    ).getDate();

    setDays(
      Array.from({ length: lastDay }, (_, i) => String(i + 1).padStart(2, "0"))
    );

    // 선택된 일이 해당 월에 없으면 마지막 날로 보정 (이미 조작이 있었던 경우에만 발생)
    if (Number(display.day) > lastDay) {
      commit({ ...display, day: String(lastDay).padStart(2, "0") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display.year, display.month]);

  // 표시 갱신 + 부모(저장값) 커밋. 사용자가 실제로 값을 정한 순간에만 호출된다.
  const commit = (next: PickerValue) => {
    setDisplay(next);
    onChange({
      userBirthYear: next.year,
      userBirthMonth: next.month,
      userBirthDay: next.day,
    });
  };

  const handlePickerChange = (newValue: PickerValue, changedKey: string) => {
    if (
      changedKey === "year" ||
      changedKey === "month" ||
      changedKey === "day"
    ) {
      commit(newValue);
    }
  };

  return (
    <Picker value={display} onChange={handlePickerChange}>
      <Picker.Column name="year">
        {years.map((y) => (
          <Picker.Item key={y} value={y}>
            {y}
          </Picker.Item>
        ))}
      </Picker.Column>

      <Picker.Column name="month">
        {months.map((m) => (
          <Picker.Item key={m} value={m}>
            {m}
          </Picker.Item>
        ))}
      </Picker.Column>

      <Picker.Column name="day">
        {days.map((d) => (
          <Picker.Item key={d} value={d}>
            {d}
          </Picker.Item>
        ))}
      </Picker.Column>
    </Picker>
  );
};
