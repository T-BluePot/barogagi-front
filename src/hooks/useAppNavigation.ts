import { useNavigate } from "react-router-dom";
import { ROUTES, getRoutePath } from "@/constants/routes";

/**
 * 타입 안전한 라우트 네비게이션을 위한 Hook
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    // Auth 관련 네비게이션
    goToHome: () => navigate(ROUTES.HOME),
    goToSignIn: () => navigate(ROUTES.AUTH.SIGNIN),
    goToSignUp: () => navigate(ROUTES.AUTH.SIGNUP),
    goToSignUpTerms: () => navigate(ROUTES.AUTH.SIGNUP_TERMS),

    // 메인 앱 네비게이션
    goToMainHome: () => navigate(ROUTES.MAIN.HOME),
    goToProfile: () => navigate(ROUTES.MAIN.PROFILE),
    goToSettings: () => navigate(ROUTES.MAIN.SETTINGS),
    goToChat: () => navigate(ROUTES.MAIN.CHAT),
    goToNotification: () => navigate(ROUTES.MAIN.NOTIFICATION),

    // 동적 라우트 네비게이션
    goToUserDetail: (userId: string) =>
      navigate(getRoutePath.user.detail(userId)),

    // 일반적인 네비게이션
    goBack: () => navigate(-1),
    replace: (path: string) => navigate(path, { replace: true }),

    // 원시 navigate 함수 (필요시)
    navigate,
  };
};
