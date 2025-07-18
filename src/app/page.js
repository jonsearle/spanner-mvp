import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="flex flex-col items-center gap-8 max-w-xl w-full">
          <Image
            src="/Spannr-logo-white.png"
            alt="spannr logo"
            width={220}
            height={220}
            priority
            className="mb-2"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#171717] text-center tracking-tight mb-2">Bookings made simple.<br className="hidden sm:block" /> Built for garages.</h1>
          <p className="text-lg sm:text-xl text-[#171717] text-center font-medium mb-6">
            Spannr helps independent garages take bookings online without the faff. Whether you&apos;re after a lightweight booking link or a full web presence, Spannr gives you the tools to manage your schedule, stay organised, and keep customers coming back.
          </p>
          <p className="text-[#171717]">Version 17.0.0 - Initial change</p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/book" className="flex-1 min-w-[160px] rounded-full bg-[#f3f4f6] text-[#d14f3f] text-lg font-bold py-3 px-6 text-center shadow hover:bg-gray-200 transition">Book Now</Link>
            <Link href="/account" className="flex-1 min-w-[160px] rounded-full bg-[#f3f4f6] text-[#d14f3f] text-lg font-bold py-3 px-6 text-center shadow hover:bg-gray-200 transition">Garage Settings</Link>
          </div>
        </div>
      </div>
      <footer className="flex justify-center items-center py-4 border-t border-[#e6edf4] bg-white">
        <span className="text-[#171717] text-sm">&copy; {new Date().getFullYear()} Spannr</span>
      </footer>
    </div>
  );
}
