import { Popper, Fade, Box } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import type { PopperProps } from "@mui/material";

import type { PopListProps } from "./Poplist";
import { PopList } from "./Poplist";

interface PopMenuProps {
  anchorEl: HTMLElement | null;
  placement?: PopperProps["placement"];

  open: boolean;
  onClose: () => void;
  listItems: PopListProps[];
}

const PopMenu = ({
  anchorEl,
  placement = "left-start",
  open,
  onClose,
  listItems,
}: PopMenuProps) => {
  return (
    <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps} timeout={350}>
            <Box
              sx={{
                p: 1,
                bgcolor: "#fafafa",
                borderRadius: 1,
                boxShadow: "0 6px 8px rgba(15, 23, 42, 0.18)",
              }}
            >
              {listItems.map((item) => (
                <PopList key={item.label} {...item} />
              ))}
            </Box>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
};

export default PopMenu;
