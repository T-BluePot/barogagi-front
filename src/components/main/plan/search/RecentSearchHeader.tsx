import { LOCATION_SEARCH_TEXT } from "@/constants/texts/main/plan/locationSearch";

const RecentSearchHeader = ({ onclick }: { onclick: () => void }) => {
  return (
    <div className="flex flex-row h-12 px-6 justify-between items-center">
      <p className="typo-caption">
        {LOCATION_SEARCH_TEXT.HEADER.RECENT_SEARCH_TITLE}
      </p>
      <button
        onClick={onclick}
        className="typo-description text-gray-40 active:bg-gray-10"
      >
        {LOCATION_SEARCH_TEXT.HEADER.CLEAR_ALL_LABEL}
      </button>
    </div>
  );
};

export default RecentSearchHeader;
