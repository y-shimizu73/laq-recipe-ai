import Link from "next/link";

export function Header({ title, backHref }: { title?: string; backHref?: string }) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
        {backHref && (
          <Link
            href={backHref}
            className="text-sm text-stone-500 transition hover:text-stone-800"
          >
            ← 戻る
          </Link>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
            LaQ Recipe AI
          </p>
          {title && <h1 className="text-lg font-semibold text-stone-900">{title}</h1>}
        </div>
      </div>
    </header>
  );
}
