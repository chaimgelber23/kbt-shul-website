import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy pt-20 pb-10 px-6 text-white border-t border-primary/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        {/* Logo & Description */}
        <div>
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="Kahal Beis Tefilla"
              width={200}
              height={100}
              className="h-14 w-auto"
              unoptimized
            />
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            A fortress of Torah in the heart of Ramat Eshkol, Jerusalem. Growing
            together in Torah and Avodas Hashem under the leadership of Rabbi
            Dovid Steinhauer.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-primary font-bold text-lg mb-6 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-4 text-white/70 text-sm font-medium">
            <li>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/about#rav"
                className="hover:text-primary transition-colors"
              >
                Our Rav
              </Link>
            </li>
            <li>
              <Link
                href="/programs"
                className="hover:text-primary transition-colors"
              >
                Programs
              </Link>
            </li>
            <li>
              <Link
                href="/shiurim"
                className="hover:text-primary transition-colors"
              >
                Shiurim
              </Link>
            </li>
            <li>
              <Link
                href="/donate"
                className="hover:text-primary transition-colors"
              >
                Donate
              </Link>
            </li>
          </ul>
        </div>

        {/* Davening */}
        <div>
          <h4 className="text-primary font-bold text-lg mb-6 uppercase tracking-wider">
            Davening
          </h4>
          <ul className="space-y-4 text-white/70 text-sm font-medium">
            <li>
              <Link
                href="/davening"
                className="hover:text-primary transition-colors"
              >
                Daily Schedule
              </Link>
            </li>
            <li>
              <Link
                href="/davening#shabbos"
                className="hover:text-primary transition-colors"
              >
                Shabbos Times
              </Link>
            </li>
            <li>
              <Link
                href="/davening#yomtov"
                className="hover:text-primary transition-colors"
              >
                Yom Tov Schedule
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-primary font-bold text-lg mb-6 uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-4 text-white/70 text-sm font-medium">
            <li className="flex gap-3">
              <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>16b Ramat Hagolan St, Jerusalem, Israel</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <Link
                href="mailto:info@kbtshul.com"
                className="hover:text-primary transition-colors"
              >
                info@kbtshul.com
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center text-white/40 text-xs tracking-widest uppercase">
        &copy; {new Date().getFullYear()} Kahal Beis Tefilla Jerusalem. All
        rights reserved.
      </div>
    </footer>
  );
}
