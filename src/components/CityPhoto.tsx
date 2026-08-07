import Image from "next/image";

/** Real city photography for each market (license-clean, see /credits). */
const CITY_PHOTO: Record<
  string,
  { src: string; alt: string; position?: string }
> = {
  chicago: {
    src: "/media/cities/chicago.jpg",
    alt: "Chicago skyline",
  },
  "new-york": {
    src: "/media/cities/new-york.jpg",
    alt: "Manhattan skyline, New York",
  },
  "santa-monica": {
    src: "/media/cities/santa-monica.jpg",
    alt: "Santa Monica Pier",
    position: "center 40%",
  },
};

export default function CityPhoto({
  city,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  city: string;
  className?: string;
  sizes?: string;
}) {
  const photo = CITY_PHOTO[city];
  if (!photo) {
    return <div className={`bg-ivory ${className}`} />;
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={photo.position ? { objectPosition: photo.position } : undefined}
      />
    </div>
  );
}
