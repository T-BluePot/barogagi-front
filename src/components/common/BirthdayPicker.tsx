import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

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
