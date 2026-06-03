import { useSettingsQuery } from "@/hooks/queries/useSettingsQuery";
import { useUpdateSettingMutation } from "@/hooks/mutations/useUpdateSettingMutation";
import {
  SETTINGS_PAGE_TEXT,
  NOTIFICATION_SETTINGS,
} from "@/constants/texts/main/settings";
import SettingsSection from "@/components/main/settings/SettingsSection";
import SettingsToggleItem from "@/components/main/settings/SettingsToggleItem";
import type { SettingType } from "@/api/types";

const SettingsPage = () => {
  const { data: settings, isLoading, isError } = useSettingsQuery();
  const updateSetting = useUpdateSettingMutation();

  const handleToggle = (type: SettingType, next: boolean) => {
    updateSetting.mutate({ type, isOn: next });
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-black text-white overflow-y-auto pb-10">
      <SettingsSection title={SETTINGS_PAGE_TEXT.NOTIFICATION_SECTION.TITLE}>
        {/* 조회 완료 전에는 상태만 노출, 성공(데이터 존재) 후에만 토글 렌더
            → 로딩/실패 중 가짜 ON 표시 방지 */}
        {isLoading && (
          <p className="typo-caption text-gray-30 px-6 py-4">
            {SETTINGS_PAGE_TEXT.LOADING}
          </p>
        )}

        {isError && (
          <p className="typo-caption text-alert-red px-6 py-4">
            {SETTINGS_PAGE_TEXT.ERROR}
          </p>
        )}

        {settings &&
          NOTIFICATION_SETTINGS.map((config) => {
            // 서버가 내려주지 않은 항목만 기본 ON (백엔드의 기본값 정책과 동일)
            const checked = settings[config.type] ?? true;

            return (
              <SettingsToggleItem
                key={config.type}
                label={config.label}
                description={config.description}
                checked={checked}
                // 백그라운드 조회 실패 시 또는 해당 항목 변경 처리 중이면 조작 차단
                disabled={isError || updateSetting.isUpdatingByType(config.type)}
                onChange={(next) => handleToggle(config.type, next)}
              />
            );
          })}
      </SettingsSection>
    </div>
  );
};

export default SettingsPage;
