interface TrendingItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface Props {
  item: TrendingItem;
  className?: string;
}

const TrendingCarouselItem = ({ item, className = "" }: Props) => {
  return (
    <div
      className={`relative w-25 h-25 aspect-1/1 rounded-full overflow-hidden flex-shrink-0 ${className}`}
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 텍스트 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-3">
        <h3 className="typo-subtitle font-bold mb-1 break-keep">
          {item.title}
        </h3>
        <p className="typo-caption text-gray-20 break-keep">{item.subtitle}</p>
      </div>
    </div>
  );
};

export default TrendingCarouselItem;
export type { TrendingItem };
