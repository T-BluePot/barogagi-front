import { CircularProgress } from "@mui/material";
import clsx from "clsx";

interface PageLoadingPropsType {
  message: string;
  isDarkBg?: boolean;
}

export default function PageLoading({
  message,
  isDarkBg = true,
}: PageLoadingPropsType) {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div
        className={clsx(
          "flex flex-row gap-2 px-4 py-3 rounded-lg items-center",
          isDarkBg ? "bg-gray-white" : "bg-gray-black"
        )}
      >
        <CircularProgress
          size={16}
          sx={{
            color: `var(--color-gray-black)`,
          }}
        />
        <p
          className={clsx(
            "typo-body",
            isDarkBg ? "text-gray-black" : "text-gray-white"
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
