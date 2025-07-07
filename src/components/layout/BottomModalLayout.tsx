import type { ReactNode } from "react";
import { Sheet } from "react-modal-sheet";

interface BottomModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const BottomModalLayout = ({
  isOpen,
  onClose,
  children,
}: BottomModalLayoutProps) => {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} detent="content-height">
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px] pointer-events-auto"
        onTap={onClose}
      />
    </Sheet>
  );
};
