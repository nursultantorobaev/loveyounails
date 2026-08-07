export default function LegalLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <article className="prose-legal">{children}</article>
    </div>
  );
}
