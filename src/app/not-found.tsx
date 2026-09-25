"use client";

import NextError from "next/error";

// Requests that never reach a locale segment (rare with the proxy in place).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <NextError statusCode={404} />
      </body>
    </html>
  );
}
