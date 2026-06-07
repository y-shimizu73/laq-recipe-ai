import Link from "next/link";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-full bg-stone-50">
      <Header />

      <main className="mx-auto flex max-w-3xl flex-col px-4 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            手持ちパーツから、
            <br />
            オリジナル作品案を提案
          </h1>
          <p className="mt-4 max-w-xl text-stone-600">
            LaQ（ラキュー）の保有パーツと作りたいジャンルを入力すると、AI が作品タイトル・
            必要パーツ・3 ステップの組み立て手順を生成します。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/manual"
            className="block rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow"
          >
            <p className="text-lg font-semibold text-stone-900">パーツを手入力する</p>
            <p className="mt-2 text-sm text-stone-500">
              色・形状・数量を入力して作品案を生成（MVP）
            </p>
          </Link>

          <div className="block rounded-xl border border-dashed border-stone-200 bg-stone-100/50 p-6 opacity-60">
            <p className="text-lg font-semibold text-stone-500">カメラで撮影する</p>
            <p className="mt-2 text-sm text-stone-400">Phase 2 で対応予定</p>
          </div>
        </div>
      </main>
    </div>
  );
}
