import { BottomModalLayout } from "@/components/layout/BottomModalLayout";
import { BottomActionHeader } from "./BottomModalHeader";

import type { ActionBottomModalProps } from "@/types/BottomModalTypes";

export const ActionBottomModal = ({
  children,
  ...layoutProps
}: ActionBottomModalProps) => (
  <BottomModalLayout {...layoutProps}>
    <BottomActionHeader
      title={layoutProps.title}
      actionLabel={layoutProps.actionLabel}
      onClickAction={layoutProps.onClickAction}
    />
    {children}
  </BottomModalLayout>
);
