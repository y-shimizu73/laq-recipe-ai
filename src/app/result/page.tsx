"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Header } from "@/components/Header";
import { RecipeResultView } from "@/components/RecipeResultView";
import type { ManualRecipeResponse } from "@/lib/types";

const STORAGE_KEY = "laq-recipe-result";

let cachedRaw: string | null | undefined;
let cachedResult: ManualRecipeResponse | null = null;

function readStoredResult(): ManualRecipeResponse | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedResult;
  }

  cachedRaw = raw;
  if (!raw) {
    cachedResult = null;
    return null;
  }

  try {
    cachedResult = JSON.parse(raw) as ManualRecipeResponse;
    return cachedResult;
  } catch {
    cachedResult = null;
    return null;
  }
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export default function ResultPage() {
  const router = useRouter();
  const redirected = useRef(false);
  const data = useSyncExternalStore(
    subscribe,
    readStoredResult,
    () => null,
  );

  useEffect(() => {
    if (data !== null || redirected.current) return;
    redirected.current = true;
    router.replace("/manual");
  }, [data, router]);

  if (data === null) {
    return (
      <div className="min-h-full bg-stone-50">
        <Header title="結果" backHref="/manual" />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center text-stone-500">
          読み込み中…
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-stone-50">
      <Header title="作品案" backHref="/manual" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <RecipeResultView result={data.result} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/manual"
            className="flex-1 rounded-lg bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-stone-800"
          >
            条件を変えて再生成
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            ホームへ
          </Link>
        </div>
      </main>
    </div>
  );
}
