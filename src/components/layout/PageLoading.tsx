import { CircularProgress } from "@mui/material";
import clsx from "clsx";

interface PageLoadingPropsType {
  message: string;
  isHeaderDark?: boolean;
}

export default function PageLoading({
  message,
  isHeaderDark = true,
}: PageLoadingPropsType) {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div
        className={clsx(
          "flex flex-row gap-2 px-4 py-3 rounded-lg items-center",
          isHeaderDark ? "bg-gray-white" : "bg-gray-black"
        )}
      >
        <CircularProgress
          size={16}
          sx={{
            color: isHeaderDark
              ? `var(--color-gray-black)`
              : `var(--color-gray-white)`,
          }}
        />
        <p
          className={clsx(
            "typo-body",
            isHeaderDark ? "text-gray-black" : "text-gray-white"
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
