import Image from "next/image";

/**
 * Screenshot or image inside a case study. Files go in /public/images/work.
 * Usage: <Figure src="/images/work/hanami-chat.png" alt="…" width="1600" height="1000" caption="…" />
 */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: string;
  height: string;
  caption?: string;
}) {
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        sizes="(min-width: 768px) 44rem, 100vw"
        className="rounded-lg border border-border"
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-fg-subtle">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
