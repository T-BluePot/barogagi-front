import IconBox from "@/components/common/IconBox";

export interface RankingItemData {
  rank: number;
  name: string;
  rankChange?: "up" | "down" | "same";
}

interface Props {
  item: RankingItemData;
  className?: string;
}

const RankingItem = ({ item, className = "" }: Props) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="typo-subtitle text-gray-black font-bold w-4">
        {item.rank}
      </span>
      <div className="flex items-center gap-1 w-full">
        <span className="typo-body text-gray-90">{item.name}</span>
        {item.rankChange === "up" && (
          <IconBox name="arrow_drop_up" width={24} className="text-alert-red" />
        )}
        {item.rankChange === "down" && (
          <IconBox
            name="arrow_drop_down"
            width={24}
            className="text-blue-500"
          />
        )}
        {item.rankChange === "same" && (
          <IconBox name="remove" width={24} className="text-gray-50" />
        )}
      </div>
    </div>
  );
};

export default RankingItem;
