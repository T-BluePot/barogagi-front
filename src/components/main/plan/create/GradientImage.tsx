import React from "react";

interface GradientImageProps {
  /**
   * 그라데이션 이미지 컴포넌트 Props
   */
  src: string; // 이미지 소스 URL
  alt?: string; // 이미지 대체 텍스트
  children?: React.ReactNode; // 이미지 위에 표시할 텍스트나 아이콘 등
}

export const GradientImage = ({
  src,
  alt = "장소 이미지",
  children,
}: GradientImageProps) => {
  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
      {/* 실제 이미지 레이어 */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-black/30 to-gray-black pointer-events-none" />

      {/* 지도 이동 레이어 */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 active:bg-black/20 transition-colors">
        <span className="typo-tag text-gray-white/80">지도 보러가기</span>
      </div>

      {/* 설명 레이어 */}
      <div className="absolute inset-x-0 bottom-0 p-4">{children}</div>
    </div>
  );
};
