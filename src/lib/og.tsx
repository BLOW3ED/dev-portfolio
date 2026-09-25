import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

// Read once per process; OG images are generated at build time.
const fonts = Promise.all([
  readFile(path.join(fontDir, "geist-sans/Geist-Regular.ttf")),
  readFile(path.join(fontDir, "geist-sans/Geist-SemiBold.ttf")),
  readFile(path.join(fontDir, "geist-mono/GeistMono-Regular.ttf")),
]);

// Dark-theme tokens from globals.css (OG images can't read CSS variables).
const colors = {
  bg: "#0b0d10",
  fg: "#e6e8eb",
  muted: "#a3abb5",
  subtle: "#8a939e",
  border: "#2f363f",
  accent: "#7ee2a8",
  warn: "#f2c14e",
};

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—-]+$/, "")}…`;
}

export async function renderOgImage({
  eyebrow,
  title,
  description,
  footer,
  status,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  footer: string;
  status?: { label: string; live: boolean };
}) {
  const [regular, semibold, mono] = await fonts;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          backgroundColor: colors.bg,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          color: colors.fg,
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "Geist Mono",
            fontSize: 24,
            color: colors.subtle,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: colors.accent }} />
          {eyebrow}
          {status ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 16 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: status.live ? colors.accent : colors.warn,
                }}
              />
              <span style={{ color: colors.muted }}>{status.label}</span>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: title.length > 60 ? 60 : 84,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2.5,
            }}
          >
            {title}
          </div>
          {description ? (
            <div style={{ fontSize: 30, lineHeight: 1.4, color: colors.muted, maxWidth: 1000 }}>
              {truncate(description, 150)}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${colors.border}`,
            paddingTop: 28,
            fontFamily: "Geist Mono",
            fontSize: 22,
            color: colors.muted,
          }}
        >
          {footer}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
