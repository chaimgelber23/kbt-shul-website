import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy pt-20 pb-10 px-6 text-white border-t border-primary/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 flex items-center justify-center bg-primary text-navy rounded shadow-md font-bold">
              &#x05E7;
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              KAHAL BEIS TEFILLA
            </h2>
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
              <span className="text-primary">&#x1F4CD;</span>
              <span>16b Ramat Hagolan St, Jerusalem, Israel</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">&#x2709;</span>
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
