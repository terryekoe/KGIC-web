export default function BookStorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Book Store</h1>
        <p className="mt-3 text-foreground/80 max-w-2xl">
          We’re setting up our online bookstore. Soon you’ll be able to purchase church-authored books here with secure checkout and instant downloads where available.
        </p>
      </header>

      <section className="mt-8 rounded-xl border border-border bg-card/40 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Catalog coming soon</h2>
            <p className="text-sm text-foreground/80">We’re curating titles now. Check back shortly.</p>
          </div>
          <div className="inline-flex items-center rounded-full border border-accent/40 px-4 py-2 text-sm text-accent">
            Coming Soon
          </div>
        </div>
      </section>
    </div>
  );
}