// SearchHeaderContents.tsx
import { useEffect } from "react";
import { SearchInput } from "@/components/common/inputs/SearchInput";
import type { SearchInputProps } from "@/components/common/inputs/SearchInput";
import AddCurrentLocationButton from "./AddCurrentLocationButton";

export interface HeaderContentsProps {
  searchInputProps: SearchInputProps; // SearchInput에 넘길 실제 값과 핸들러
  handleAddCurrentLocation: () => void; // 현재 위치 추가 버튼 핸들러
}

const SearchHeaderContents = ({
  searchInputProps,
  handleAddCurrentLocation,
}: HeaderContentsProps) => {
  // 컴포넌트 렌더 시점에 실제 props 값에 접근해야 콘솔에 출력됨
  // 타입 이름(HeaderContentsProps)은 설계도일 뿐 런타임에 값이 없다.
  useEffect(() => {
    // 값이 문자열이 아닐 수도 있다면 안전하게 optional chaining을 사용
    console.log("search value:", searchInputProps?.value);
  }, [searchInputProps?.value]);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* 검색 인풋에 받은 props 그대로 전달 */}
      <SearchInput {...searchInputProps} />
      {/* 현재 위치 추가 버튼 */}
      <AddCurrentLocationButton
        handleAddCurrentLocation={handleAddCurrentLocation}
      />
    </div>
  );
};

export default SearchHeaderContents;
