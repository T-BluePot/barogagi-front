import NaverIcon from "@/assets/icons/naver-circle.png";
import KakaoIcon from "@/assets/icons/kakao-circle.png";
import GoogleIcon from "@/assets/icons/google-circle.png";

type Props = {
  platform: "naver" | "kakao" | "google";
  onClick: () => void;
  className?: string;
};

export const SnsButton = (props: Props) => {
  const { platform, onClick, className } = props;

  const platformConfig = {
    naver: {
      icon: NaverIcon,
      alt: "네이버 로그인",
      hoverClass: "hover:scale-105",
    },
    kakao: {
      icon: KakaoIcon,
      alt: "카카오 로그인",
      hoverClass: "hover:scale-105",
    },
    google: {
      icon: GoogleIcon,
      alt: "구글 로그인",
      hoverClass: "hover:scale-105",
    },
  };

  const config = platformConfig[platform];

  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 ${config.hoverClass} ${className}`}
    >
      <img
        src={config.icon}
        alt={config.alt}
        className="w-full h-full rounded-full"
      />
    </button>
  );
};
