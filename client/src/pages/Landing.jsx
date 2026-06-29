import React from "react";
import {
  MessageCircle,
  Users,
  Bot,
  ArrowRight,
  Hash,
  Sparkles,
  Plus,
} from "lucide-react";
import {COLORS,FONT_DISPLAY,FONT_BODY} from "../utils/constants"
import { Link } from "react-router-dom";




function NavBar() {
  return (
    <header
      style={{ fontFamily: FONT_BODY }}
      className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-6xl mx-auto w-full"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 34,
            height: 34,
            background: `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.coral})`,
          }}
        >
          <MessageCircle size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <span
          style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }}
          className="text-xl font-bold tracking-tight"
        >
          DevChat
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {["Explore groups", "AI chat", "How it works", "Pricing"].map(
          (item) => (
            <a
              key={item}
              href="#"
              style={{ color: COLORS.inkSoft }}
              className="text-sm font-medium hover:text-[#171123] transition-colors"
            >
              {item}
            </a>
          )
        )}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          style={{ color: COLORS.ink }}
          className="hidden sm:inline text-sm font-medium"
        >
          Log in
        </Link>
        <button
          style={{
            background: COLORS.ink,
            color: "#fff",
            fontFamily: FONT_BODY,
          }}
          className="text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Join free
        </button>
      </div>
    </header>
  );
}

function BubbleCluster() {
  const shard = (style) => (
    <div
      className="absolute rounded-[36%_64%_60%_40%/48%_42%_58%_52%]"
      style={{
        boxShadow: "0 18px 40px -12px rgba(91,79,224,0.35)",
        ...style,
      }}
    />
  );

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] flex items-center justify-center select-none">
      {/* glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          background: `radial-gradient(circle, ${COLORS.indigo}22, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />

      {shard({
        width: 150,
        height: 150,
        background: `linear-gradient(140deg, ${COLORS.indigo}, ${COLORS.indigoDeep})`,
        transform: "rotate(-12deg)",
        left: "calc(50% - 110px)",
        top: 30,
      })}
      {shard({
        width: 120,
        height: 120,
        background: `linear-gradient(140deg, ${COLORS.coral}, #E8503D)`,
        transform: "rotate(18deg)",
        left: "calc(50% + 10px)",
        top: 10,
        opacity: 0.96,
      })}
      {shard({
        width: 100,
        height: 100,
        background: `linear-gradient(140deg, ${COLORS.mint}, #1FB489)`,
        transform: "rotate(-6deg)",
        left: "calc(50% + 60px)",
        top: 110,
        opacity: 0.92,
      })}
      {shard({
        width: 90,
        height: 90,
        background: `linear-gradient(140deg, #8C82F0, ${COLORS.indigo})`,
        transform: "rotate(8deg)",
        left: "calc(50% - 130px)",
        top: 130,
        opacity: 0.9,
      })}

      {/* Group chat preview */}
      <div
        className="absolute flex items-center gap-2 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-lg"
        style={{
          background: COLORS.card,
          left: "calc(50% - 230px)",
          top: 150,
          maxWidth: 230,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 26, height: 26, background: COLORS.indigo }}
        >
          <Hash size={13} color="#fff" />
        </div>
        <p style={{ color: COLORS.ink }} className="text-xs sm:text-sm font-medium leading-snug">
          anyone up for chess tonight in #weekend-plans?
        </p>
      </div>

      {/* AI chat preview */}
      <div
        className="absolute flex items-center gap-2 rounded-2xl rounded-br-sm px-4 py-2.5 shadow-lg"
        style={{
          background: COLORS.ink,
          right: "calc(50% - 250px)",
          top: 40,
          maxWidth: 220,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 26, height: 26, background: COLORS.coral }}
        >
          <Bot size={13} color="#fff" />
        </div>
        <p className="text-xs sm:text-sm font-medium leading-snug text-white">
          Sure — want me to find 3 open tables nearby?
        </p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      style={{ fontFamily: FONT_BODY }}
      className="max-w-4xl mx-auto px-6 pt-6 sm:pt-10 pb-16 text-center"
    >
      <BubbleCluster />

      <h1
        style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }}
        className="mt-6 text-4xl sm:text-5xl md:text-[3.4rem] font-bold tracking-tight leading-[1.08]"
      >
        Your people. Your groups.
        <br />
        One AI that's always around.
      </h1>

      <p
        style={{ color: COLORS.inkSoft }}
        className="mt-5 text-base sm:text-lg max-w-xl mx-auto"
      >
        DevChat is a place to join communities, chat with friends, spin up
        a group in seconds — and ask the built-in AI whenever there's no
        one else to ask.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          style={{ background: COLORS.indigo, fontFamily: FONT_BODY }}
          className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Start chatting free
          <ArrowRight size={17} />
        </button>
        <button
          style={{
            color: COLORS.ink,
            borderColor: COLORS.line,
            fontFamily: FONT_BODY,
          }}
          className="font-semibold px-7 py-3.5 rounded-full border-2 hover:bg-white transition-colors"
        >
          See how it works
        </button>
      </div>

      <p style={{ color: COLORS.inkSoft }} className="mt-4 text-xs">
        Free to join · No credit card · 40,000+ groups already huddling
      </p>
    </section>
  );
}

function FeatureCard({ icon, accent, title, desc }) {
  return (
    <div
      style={{ background: COLORS.card, borderColor: COLORS.line }}
      className="rounded-3xl border p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{ width: 44, height: 44, background: accent }}
      >
        {icon}
      </div>
      <h3
        style={{ fontFamily: FONT_DISPLAY, color: COLORS.ink }}
        className="text-lg font-bold"
      >
        {title}
      </h3>
      <p style={{ color: COLORS.inkSoft }} className="text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function Features() {
  return (
    <section
      style={{ fontFamily: FONT_BODY }}
      className="max-w-5xl mx-auto px-6 pb-20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <FeatureCard
          icon={<Users size={20} color="#fff" />}
          accent={COLORS.indigo}
          title="Join or start a group"
          desc="Find communities built around what you're into, or spin up a private group for your own crew in a few taps."
        />
        <FeatureCard
          icon={<MessageCircle size={20} color="#fff" />}
          accent={COLORS.mint}
          title="Real chat, no clutter"
          desc="Fast, threaded conversations with the people who actually reply — DMs and group chat in the same simple flow."
        />
        <FeatureCard
          icon={<Bot size={20} color="#fff" />}
          accent={COLORS.coral}
          title="Or just ask the AI"
          desc="Stuck on a question, planning something, or it's 2am and everyone's asleep? The AI in DevChat is always up."
        />
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-24">
      <div
        className="rounded-[2rem] px-8 sm:px-14 py-12 sm:py-16 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.ink}, #2A2140)`,
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 260,
            height: 260,
            background: `radial-gradient(circle, ${COLORS.coral}33, transparent 70%)`,
            top: -80,
            right: -60,
          }}
        />
        <Sparkles size={22} color={COLORS.mint} className="mx-auto mb-4" />
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-white text-2xl sm:text-3xl font-bold tracking-tight"
        >
          Your next group chat is one tap away.
        </h2>
        <p style={{ color: "#C9C3E0", fontFamily: FONT_BODY }} className="mt-3 text-sm sm:text-base">
          Bring your people together, or just bring yourself — the AI's here either way.
        </p>
        <button
          style={{ background: COLORS.coral, fontFamily: FONT_BODY }}
          className="mt-7 inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <Plus size={17} />
          Create your DevChat
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{ borderColor: COLORS.line, color: COLORS.inkSoft, fontFamily: FONT_BODY }}
      className="max-w-5xl mx-auto px-6 py-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
    >
      <span>© {new Date().getFullYear()} DevChat. All chats welcome.</span>
      <div className="flex items-center gap-5">
        <a href="#" className="hover:text-[#171123]">Privacy</a>
        <a href="#" className="hover:text-[#171123]">Terms</a>
        <a href="#" className="hover:text-[#171123]">Contact</a>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      <NavBar />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
}