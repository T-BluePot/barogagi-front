import { BackHeader } from "@/components/common/headers/BackHeader";
import {
  SearchInput,
  type SearchInputProps,
} from "@/components/common/inputs/SearchInput";

interface SearchBackHeaderProps {
  onClick: () => void;
  searchProps: SearchInputProps;
}

const SearchBackHeader = ({ onClick, searchProps }: SearchBackHeaderProps) => {
  return (
    <BackHeader onClick={onClick}>
      <SearchInput {...searchProps} />
    </BackHeader>
  );
};

export default SearchBackHeader;
