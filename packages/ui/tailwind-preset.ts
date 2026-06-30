import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        surface: "var(--surface)",
        cream: "var(--cream)",
        sand: "var(--sand)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-soft": "var(--ink-soft)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        coral: "var(--coral)",
        "coral-600": "var(--coral-600)",
        "coral-press": "var(--coral-press)",
        "coral-tint": "var(--coral-tint)",
        naver: "var(--naver)",
        insta: "var(--insta)",
        kakao: "var(--kakao)",
        good: "var(--good)",
        warn: "var(--warn)",
        urgent: "var(--urgent)",
        "good-tint": "var(--good-tint)",
        "warn-tint": "var(--warn-tint)",
        "urgent-tint": "var(--urgent-tint)",
        "surface-2": "var(--surface-2)",
        accent: "var(--accent)",
        "accent-600": "var(--accent-600)",
        "accent-press": "var(--accent-press)",
        "accent-tint": "var(--accent-tint)",
        "on-accent": "var(--on-accent)",
        "kakao-ink": "var(--kakao-ink)",
      },
      borderRadius: { DEFAULT: "var(--radius)", sm: "var(--radius-sm)", lg: "var(--radius-lg)" },
      fontFamily: {
        display: ["var(--font-jua)", "sans-serif"],
        sans: ["var(--font-noto-kr)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
};

export default preset;
