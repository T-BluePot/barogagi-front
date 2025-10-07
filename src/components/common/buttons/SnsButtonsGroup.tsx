import { SnsButton } from "@/components/common/buttons/SnsButton";
interface SnsButtonsGroupProps {
  onNaverClick: () => void;
  onKakaoClick: () => void;
  onGoogleClick: () => void;
}

export const SnsButtonsGroup = (props: SnsButtonsGroupProps) => {
  return (
    <div className="flex gap-6 justify-center">
      {/* 네이버 버튼 */}
      <SnsButton
        platform="naver"
        onClick={props.onNaverClick}
        className="text-white font-bold text-xl"
      />

      {/* 카카오 버튼 */}
      <SnsButton
        platform="kakao"
        onClick={props.onKakaoClick}
        className="text-black font-bold text-sm"
      />

      {/* 구글 버튼 */}
      <SnsButton
        platform="google"
        onClick={props.onGoogleClick}
        className="text-gray-700 font-bold text-xl"
      />
    </div>
  );
};
