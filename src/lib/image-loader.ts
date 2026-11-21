// Custom next/image loader: lets the image CDNs resize and convert images
// themselves instead of proxying every photo through the Next.js optimizer.
type LoaderProps = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderProps) {
  const q = quality ?? 75;

  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }

  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    return src.replace("/upload/", `/upload/f_auto,q_${q},c_limit,w_${width}/`);
  }

  // Local files (logo, development uploads) are served as-is.
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
