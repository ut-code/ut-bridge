// /ja, /enを表現
export const PATHNAME_LANG_PREFIX_PATTERN = /^\/(ja|en)/;

// registration formのstep 1の入力内容をsession storageに保存するkey
export const STEP_1_DATA_SESSION_STORAGE_KEY = "ut_bridge_step_1_data";
// registration formのimagePreviewUrlをsession storageに保存するkey
export const IMAGE_PREVIEW_URL_SESSION_STORAGE_KEY = "ut_bridge_image_preview_url";

export const cookieNames = {
  idToken: "ut-bridge::id-token",
};
