import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-0">
        <section className="relative z-10 flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-white px-6 py-8 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </section>

        <section className="relative min-h-[320px] min-w-0 overflow-hidden border-l border-zinc-200 isolate lg:min-h-screen">
          <Image
            src="/login-hero.png"
            alt="Richemont annual results decorative artwork"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </section>
      </div>
    </main>
  );
}
