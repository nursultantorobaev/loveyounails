import Button from "./ui/Button";

/** Full-bleed autoplaying video intro with a bottom scrim for legible text. */
export default function VideoHero() {
  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-espresso">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/photos/nails-nude-macro.png"
      >
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>

      {/* Scrim: darkened at the bottom so text stays legible over any frame */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(28,20,14,0.68) 0%, rgba(28,20,14,0.30) 38%, rgba(28,20,14,0.10) 70%, rgba(28,20,14,0.18) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 md:px-8 md:pb-24">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-cream/80">
          Premium Beauty Salon
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] text-cream md:text-8xl">
          Love You Nail Salon
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-cream/85 md:text-lg">
          E-file manicure, impeccable sterility and style that delights at first
          sight.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/locations" variant="light">
            Book Appointment
          </Button>
          <Button href="/#services" variant="glass">
            Explore Services
          </Button>
        </div>
      </div>
    </section>
  );
}
