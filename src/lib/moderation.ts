import { NG_WORDS } from "@/lib/constants";

const URL_PATTERN = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(com|net|org|jp|io|co))/i;

export function validateMemo(text: string) {
  if (text.length > 200) {
    return "自由記述は200字以内で入力してください。";
  }
  if (URL_PATTERN.test(text)) {
    return "外部リンクは禁止です。";
  }

  const lower = text.toLowerCase();
  const hit = NG_WORDS.find((word) => lower.includes(word.toLowerCase()));
  if (hit) {
    return `NGワードを検知しました: ${hit}`;
  }

  return null;
}
