import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#01263B] text-white pt-10 pb-6">
      <div className="w-full px-10 2xl:px-16">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-10 mb-8">

          {/* Logo + Address */}
          <div>
            <Link to="/">
              <img
                src={logo}
                alt="InGO Logo"
                className="h-28 mb-4 object-contain"
              />
            </Link>

            <div className="space-y-3 text-cyan-100/80 text-xl">
              <p>3/2, Magrath Road</p>
              <p>Bengaluru – 560025</p>

              <p className="pt-2">
                <span className="font-semibold text-white">Sales:</span>{" "}
                +91 70199 08703
              </p>

              <p>
                <span className="font-semibold text-white">Service:</span>{" "}
                +91 82172 54248
              </p>

              <p className="pt-2">
              🕒 Mon – Sat, 9:00 AM – 7:00 PM
              </p>
            </div>
          </div>

          {/* Service Management */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-cyan-300">
              Service Management
            </h3>
            <p className="text-cyan-100/80 text-2xl leading-relaxed">
              Professional vehicle service management system providing reliable
              and efficient service solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-cyan-300">
              Quick Links
            </h3>
            <ul className="space-y-4 text-cyan-100/80 text-2xl">
              <li>
                <a
                  href="https://ingoelectric.com/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="lg:text-cnetred">
            <h3 className="text-2xl font-semibold mb-6 text-cyan-300">
              Follow Us
            </h3>

            <div className="flex gap-6 lg:justify-centred mb-6">
              <a
                href="https://www.instagram.com/ingoelectric/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                <Instagram size={28} />
              </a>

              <a
                href="https://www.facebook.com/inGOelectric/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                <Facebook size={28} />
              </a>

              <a
                href="https://x.com/ingoelectric"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                <Twitter size={28} />
              </a>

              <a
                href="https://www.linkedin.com/company/14494503/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                <Linkedin size={28} />
              </a>

              <a
                href="https://www.youtube.com/channel/UCmOL3sU645-OIChE4Do_e1g"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                <Youtube size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="flex justify-end gap-8 text-xl mb-6">
          <a
            href="https://ingoelectric.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition"
          >
            Privacy Policy
          </a>

          <a
            href="https://ingoelectric.com/terms-conditions/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition"
          >
            Terms & Conditions
          </a>
        </div>

        {/* Bottom */}
        <div className="border-t border-cyan-900 pt-6 text-2xl text-cyan-100/70 text-center">
          © 2026 Service System. All rights reserved.
        </div>

      </div>
    </footer>
  );
}