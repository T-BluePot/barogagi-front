import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

// 값이 비어 있을 때 커밋할 기본 생년월일.
// 휠 픽커는 빈 값을 표시할 수 없어 현재년도(2026)가 아니라 생일로 무난한 2000년을 기본으로 둔다.
const DEFAULT_BIRTH_YEAR = "2000";
const DEFAULT_BIRTH_MONTH = "01";
const DEFAULT_BIRTH_DAY = "01";

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
  const [days, setDays] = useState<string[]>([]);

  // 모달이 열릴 때(이 컴포넌트가 마운트될 때) 값이 하나라도 비어 있으면 기본값을 커밋한다.
  // 휠 픽커는 빈 값을 표시할 수 없어 화면엔 첫 항목이 보이지만, 사용자가 직접 굴리지 않은
  // 컬럼은 값이 state에 저장되지 않는다. 이로 인해 "생일을 골라도 저장이 안 되던" 문제를 막는다.
  useEffect(() => {
    if (userBirthYear && userBirthMonth && userBirthDay) return;
    onChange({
      userBirthYear: userBirthYear || DEFAULT_BIRTH_YEAR,
      userBirthMonth: userBirthMonth || DEFAULT_BIRTH_MONTH,
      userBirthDay: userBirthDay || DEFAULT_BIRTH_DAY,
    });
    // 마운트 시 1회만 기본값을 시딩한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 연도나 월 변경 시 → 해당 월의 마지막 일자 계산
  useEffect(() => {
    const lastDay = new Date(
      Number(userBirthYear),
      Number(userBirthMonth),
      0
    ).getDate();

    const dayList = Array.from({ length: lastDay }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );

    setDays(dayList);

    // 선택된 일이 존재하지 않는 경우 마지막 날로 보정
    if (userBirthDay && Number(userBirthDay) > lastDay) {
      onChange({
        userBirthYear,
        userBirthMonth,
        userBirthDay: String(lastDay).padStart(2, "0"),
      });
    }
  }, [userBirthYear, userBirthMonth]);

  // Picker에서 요구하는 내부 구조
  const pickerValue = {
    year: userBirthYear,
    month: userBirthMonth,
    day: userBirthDay,
  };

  // Picker에서 값 변경 시 호출
  const handlePickerChange = (
    newValue: { year: string; month: string; day: string },
    changedKey: string
  ) => {
    if (
      changedKey === "year" ||
      changedKey === "month" ||
      changedKey === "day"
    ) {
      onChange({
        userBirthYear: newValue.year,
        userBirthMonth: newValue.month,
        userBirthDay: newValue.day,
      });
    }
  };

  return (
    <Picker value={pickerValue} onChange={handlePickerChange}>
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
