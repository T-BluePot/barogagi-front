import { useCallback, useEffect, useRef, useState } from "react";
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
import toast from "react-hot-toast";

export interface PlanCategoryBottomModalContentProps {
  onSelectOption: (selected: SelectedCategoryItemType) => void;
}

export const PlanCategoryBottomModalContent = ({
  onSelectOption,
}: PlanCategoryBottomModalContentProps) => {
  // === 스크롤 컨테이너 ref ===
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollOptionsToTop = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      if (!listRef.current) return;
      listRef.current.scrollTo({ top: 0, behavior });
    },
    []
  );

  // === 카테고리 / 아이템 state ===
  const [categories, setCategories] = useState<ScheduleCategoryResponseType[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ScheduleCategoryResponseType | null>(null);

  const [categoryItems, setCategoryItems] = useState<
    ScheduleCategoryItemResponseType[]
  >([]);

  // selectedCategory의 "최신 값"을 항상 가리키는 ref (race condition 방지용)
  const selectedCategoryRef = useRef<ScheduleCategoryResponseType | null>(null);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  // === 카테고리 목록 불러오기 ===
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getScheduleCategories();
        const list = res.data as ScheduleCategoryResponseType[];

        setCategories(list);

        // 최초 진입 시 첫 카테고리 자동 선택 (원치 않으면 삭제)
        if (list.length > 0) {
          setSelectedCategory(list[0]);
        }
      } catch (error) {
        console.error("카테고리 목록 불러오기 실패:", error);
        toast("카테고리 목록을 불러오지 못했어요.");
      }
    };

    fetchCategories();
  }, []);

  // === 선택된 카테고리 상세 아이템 불러오기 (race condition 방지) ===
  useEffect(() => {
    const fetchCategoryDetail = async () => {
      if (!selectedCategory) {
        setCategoryItems([]);
        return;
      }

      const requestedCategoryNum = selectedCategory.categoryNum;

      try {
        const res = await getScheduleCategoryDetail(requestedCategoryNum);
        const items = res.data as ScheduleCategoryItemResponseType[];

        // 응답 도착 시점의 "현재 선택"과 요청 시점이 다르면 무시
        if (selectedCategoryRef.current?.categoryNum !== requestedCategoryNum) {
          return;
        }

        setCategoryItems(items);
      } catch (error) {
        console.error("카테고리 상세 불러오기 실패:", error);
        toast("카테고리 상세를 불러오지 못했어요.");
      }
    };

    fetchCategoryDetail();
  }, [selectedCategory]);

  // 상세 아이템이 새로 로드될 때 스크롤 상단 고정
  useEffect(() => {
    scrollOptionsToTop("auto");
  }, [categoryItems]);

  const handleClickCategoryTab = (category: ScheduleCategoryResponseType) => {
    setSelectedCategory(category);
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
            className={`shrink-0 px-4 py-2 rounded-full typo-body transition-colors ${
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
                  option.itemNm === "랜덤" ? "font-semibold" : ""
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
