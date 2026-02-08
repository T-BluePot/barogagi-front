import { useMutation } from "@tanstack/react-query";
import type { LoginRequestType } from "@/api/types";
import { login } from "@/api/queries";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export type LoginInputType = Pick<LoginRequestType, "userId" | "password">;

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ userId, password }: LoginInputType) => {
      return await login(userId, password);
    },
    onSuccess: () => {
      navigate(ROUTES.MAIN.HOME);
    },

    onError: (error: unknown) => {
      // 에러 메시지는 UI에서 처리하도록 throw
      throw error;
    },
  });
};
