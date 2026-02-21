import { useEffect, useState, useRef } from "react";
import IconBox from "@/components/common/IconBox";

// === types ===
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

// === server ===
import {
  getScheduleCategories,
  getScheduleCategoryDetail,
} from "@/api/queries";
import type {
  ScheduleCategoryResponseType,
  ScheduleCategoryItemResponseType,
} from "@/api/types";

export interface PlanCategoryBottomModalContentProps {
  onSelectOption: (selected: SelectedCategoryItemType) => void;
}

export const PlanCategoryBottomModalContent = ({
  onSelectOption,
}: PlanCategoryBottomModalContentProps) => {
  // === 스크롤 컨테이너 ref ===
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollOptionsToTop = (behavior: ScrollBehavior = "auto") => {
    // 스크롤 컨테이너가 존재할 때만 상단으로 이동
    if (!listRef.current) return;

    // 부드럽게 올리고 싶으면 behavior: "smooth"
    listRef.current.scrollTo({ top: 0, behavior });
  };

  // === 카테고리 연결 ===
  const [categories, setCategories] = useState<ScheduleCategoryResponseType[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ScheduleCategoryResponseType | null>(null);

  // 카테고리 탭 데이터 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getScheduleCategories();
        const list = res.data as ScheduleCategoryResponseType[];

        setCategories(list);

        if (list.length > 0) {
          setSelectedCategory(list[0]);
          scrollOptionsToTop("auto");
        }
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategoryType = selectedCategory?.categoryNm;

  // === 선택된 카테고리 상세 아이템(서버 데이터) ===
  const [categoryItems, setCategoryItems] = useState<
    ScheduleCategoryItemResponseType[]
  >([]);

  // 카테고리 선택 시 상세 아이템 불러오기
  useEffect(() => {
    const fetchCategoryDetail = async () => {
      if (!selectedCategory) return;
      try {
        const res = await getScheduleCategoryDetail(
          selectedCategory.categoryNum
        );
        const items = res.data as ScheduleCategoryItemResponseType[];
        setCategoryItems(items);
      } catch (error) {
        console.error("카테고리 상세 불러오기 실패:", error);
      }
    };

    fetchCategoryDetail();
  }, [selectedCategory, selectedCategoryType]);

  // 상세 아이템이 새로 로드될 때(리스트 갱신) 스크롤을 상단으로 고정
  useEffect(() => {
    scrollOptionsToTop("auto");
  }, [categoryItems]);

  const handleClickCategoryTab = (category: ScheduleCategoryResponseType) => {
    setSelectedCategory(category);
    // 탭 클릭 즉시 상단으로(UX 체감 좋아짐)
    scrollOptionsToTop("auto");
  };

  return (
    <div className="flex flex-col">
      {/* 카테고리 탭 */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.categoryNum}
            type="button"
            onClick={() => handleClickCategoryTab(category)}
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
        <div
          ref={listRef}
          className="flex flex-col h-52 overflow-y-auto scrollbar-hide"
        >
          {categoryItems.map((option) => (
            <button
              key={option.itemNum}
              type="button"
              onClick={() => {
                if (!selectedCategory) return;

                onSelectOption({
                  category: {
                    categoryNum: selectedCategory.categoryNum,
                    categoryNm: selectedCategory.categoryNm,
                  },
                  option: {
                    itemNum: option.itemNum,
                    itemNm: option.itemNm,
                  },
                });
              }}
              className="flex flex-shrink-0 items-center justify-between h-14 px-6 hover:bg-gray-5 transition-colors"
            >
              <span
                className={`typo-body text-gray-black ${
                  option.itemNm === "랜덤" && "font-semibold"
                }`}
              >
                {option.itemNm}
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
    </div>
  );
};

export default PlanCategoryBottomModalContent;
