import { useRef, useState } from "react";

import { Popper, Fade, Box } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

import Button from "@/components/common/buttons/CommonButton";

import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

interface FooterProps {
  onConfirm: () => void;
  onRegenerate: () => void;
}

const RoutesCreateFooter = ({ onConfirm, onRegenerate }: FooterProps) => {
  const helpButtonRef = useRef<HTMLButtonElement | null>(null);
  const [helpAnchor, setHelpAnchor] = useState<HTMLElement | null>(null);

  const toggleHelp = () => {
    setHelpAnchor((prev) => (prev ? null : helpButtonRef.current));
  };

  const closeHelp = (event?: MouseEvent | TouchEvent) => {
    // "?" 버튼 클릭은 toggleHelp가 처리하므로 clickaway에서 제외
    if (event && helpButtonRef.current?.contains(event.target as Node)) return;
    setHelpAnchor(null);
  };

  return (
    <>
      <div className="h-2 bg-linear-to-b from-gray-white/0 to-gray-white" />
      <div className="flex flex-col gap-3 w-full p-6 pt-2 bg-gray-white">
        <div className="flex items-center px-2 gap-1">
          <button
            type="button"
            ref={helpButtonRef}
            onClick={toggleHelp}
            aria-label="다시 만들기 안내"
            className="flex items-center gap-1 shrink-0 p-2 transition-opacity active:opacity-70"
          >
            <HelpOutlineIcon className="text-caption! text-gray-30" />
            <span className="typo-description text-gray-30">
              일정 다시 만들기란?
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1 shrink-0 px-3 py-3 typo-body text-gray-50 active:text-gray-black transition-colors"
          >
            <RefreshIcon className="text-title-02!" />
            {ROUTES_CREATE_TEXT.FOOTER_REGENERATE_LABEL}
          </button>
          <div className="flex-1">
            <Button
              label={ROUTES_CREATE_TEXT.FOOTER_BUTTON_LABEL}
              onClick={onConfirm}
            />
          </div>
        </div>
      </div>
      <Popper
        open={Boolean(helpAnchor)}
        anchorEl={helpAnchor}
        placement="top-end"
        transition
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={closeHelp}>
            <Fade {...TransitionProps} timeout={350}>
              <Box className="max-w-60 p-3 bg-gray-white rounded-xl shadow-[0_6px_16px_rgba(15,23,42,0.15)]">
                <p className="typo-caption text-gray-70 whitespace-pre-line">
                  {ROUTES_CREATE_TEXT.FOOTER_KEPT_NOTICE}
                </p>
              </Box>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default RoutesCreateFooter;
