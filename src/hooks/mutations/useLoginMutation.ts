import { useMutation } from "@tanstack/react-query";

// === route ===
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

import { login } from "@/api/queries";
import type { LoginRequestType } from "@/api/types";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";

export type LoginInputType = Pick<LoginRequestType, "userId" | "password">;

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ userId, password }: LoginInputType) => {
      return await login(userId, password);
    },
    onSuccess: (response) => {
      const tokenBundle = response.data;
      saveAuthTokens(tokenBundle);

      navigate(ROUTES.MAIN.HOME);
    },

    onError: () => {
      // 에러 메시지는 UI에서 처리하도록 비움
    },
  });
};
