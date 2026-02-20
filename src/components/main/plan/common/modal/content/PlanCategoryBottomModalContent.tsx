import { useEffect, useMemo, useState } from "react";
import IconBox from "@/components/common/IconBox";

// === server ===
import { getScheduleCategories } from "@/api/queries";
import type { ScheduleCategoryResponseType } from "@/types/api/scheduleTypes";

// 카테고리 타입 정의
export type CategoryType =
  | "식사"
  | "카페"
  | "체험"
  | "놀거리"
  | "탐방"
  | "레저";

export interface CategoryOption {
  id: string;
  label: string;
  isRandom?: boolean;
  isCustom?: boolean;
}

interface CategoryData {
  type: CategoryType;
  options: CategoryOption[];
}

// 카테고리별 옵션 데이터
const CATEGORY_DATA: CategoryData[] = [
  {
    type: "식사",
    options: [
      { id: "random", label: "랜덤", isRandom: true },
      { id: "custom", label: "직접 등록하기", isCustom: true },
      { id: "western", label: "양식" },
      { id: "japanese", label: "일식" },
      { id: "chinese", label: "중식" },
      { id: "korean", label: "한식" },
      { id: "asian", label: "아시안" },
    ],
  },
  {
    type: "카페",
    options: [
      { id: "random", label: "랜덤", isRandom: true },
      { id: "custom", label: "직접 등록하기", isCustom: true },
      { id: "dessert", label: "디저트" },
      { id: "brunch", label: "브런치" },
      { id: "bakery", label: "베이커리" },
    ],
  },
  {
    type: "체험",
    options: [
      { id: "random", label: "랜덤", isRandom: true },
      { id: "custom", label: "직접 등록하기", isCustom: true },
      { id: "craft", label: "공방" },
      { id: "cooking", label: "쿠킹클래스" },
    ],
  },
  {
    type: "놀거리",
    options: [
      { id: "random", label: "랜덤", isRandom: true },
      { id: "custom", label: "직접 등록하기", isCustom: true },
      { id: "game", label: "오락" },
      { id: "karaoke", label: "노래방" },
    ],
  },
  {
    type: "탐방",
    options: [
      { id: "random", label: "랜덤", isRandom: true },
      { id: "custom", label: "직접 등록하기", isCustom: true },
      { id: "museum", label: "박물관" },
      { id: "gallery", label: "전시" },
    ],
  },
  {
    type: "레저",
    options: [
      { id: "random", label: "랜덤", isRandom: true },
      { id: "custom", label: "직접 등록하기", isCustom: true },
      { id: "sports", label: "스포츠" },
      { id: "outdoor", label: "아웃도어" },
    ],
  },
];

interface PlanCategoryBottomModalContentProps {
  onSelectOption: (category: CategoryType, option: CategoryOption) => void;
}

export const PlanCategoryBottomModalContent = ({
  onSelectOption,
}: PlanCategoryBottomModalContentProps) => {
  // === 카테고리 연결 ===
  const [categories, setCategories] = useState<ScheduleCategoryResponseType[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ScheduleCategoryResponseType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getScheduleCategories();
        const list = res.data as ScheduleCategoryResponseType[];

        setCategories(list);

        if (list.length > 0) {
          setSelectedCategory(list[0]);
        }
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScheduleCategories();
        console.log("카테고리 API 응답:", data);
      } catch (error) {
        console.error("에러:", error);
      }
    };

    fetchData();
  }, []);

  const currentOptions =
    CATEGORY_DATA.find((c) => c.type === selectedCategory?.categoryNm)
      ?.options ?? [];

  return (
    <div className="flex flex-col">
      {/* 카테고리 탭 */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.categoryNum}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-full typo-body transition-colors ${
              selectedCategory?.categoryNum === category.categoryNum
                ? "bg-main text-gray-black"
                : "bg-gray-10 text-gray-60"
            }`}
          >
            {category.categoryNm}
          </button>
        ))}
      </div>

      {/* 옵션 리스트 */}
      <div className="flex flex-col">
        {currentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectOption("놀거리", option)}
            className="flex items-center justify-between h-14 px-6 hover:bg-gray-5 transition-colors"
          >
            <span
              className={`typo-body text-gray-black ${
                option.isRandom || option.isCustom ? "font-semibold" : ""
              }`}
            >
              {option.label}
            </span>
            <IconBox
              name="add"
              className="text-gray-40"
              width={24}
              height={24}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlanCategoryBottomModalContent;
