import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function Contribute() {
  return (
    <section
      id="support"
      className="border-t border-gray-100 bg-white px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4">
          <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
            GET INVOLVED
          </div>
          <h2 className="max-w-2xl text-xl leading-tight font-extrabold text-black sm:text-2xl md:text-3xl">
            Airhop is open source. It gets better when more people contribute.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-black sm:p-8"
          >
            <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100" />
            <div className="space-y-4">
              <div className="font-mono text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                CONTRIBUTE
              </div>
              <h3 className="text-lg font-bold text-black">Star and contribute on GitHub</h3>
              <p className="font-mono text-xs leading-relaxed font-light text-gray-600 sm:text-sm">
                Star the repo, open issues, and submit pull requests. The project is MIT licensed.
                Bug reports, feature proposals, and code contributions are all welcome.
              </p>
              <a
                href="https://github.com/areebahmeddd/Airhop"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn mt-2 inline-flex items-center gap-2 bg-black px-5 py-2.5 font-mono text-xs font-bold tracking-widest text-white transition-all hover:bg-black/90"
              >
                VIEW ON GITHUB
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative overflow-hidden border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-black sm:p-8"
          >
            <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100" />
            <div className="space-y-4">
              <div className="font-mono text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                SUPPORT
              </div>
              <h3 className="text-lg font-bold text-black">Keep the project going</h3>
              <p className="font-mono text-xs leading-relaxed font-light text-gray-600 sm:text-sm">
                I build Airhop in my free time. There are no investors and no ads. If it is useful
                to you, a small donation goes a long way toward keeping development active.
              </p>
              <a
                href="https://razorpay.me/@1mindlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn mt-2 inline-flex items-center gap-2 border border-black px-5 py-2.5 font-mono text-xs font-bold tracking-widest text-black transition-all hover:bg-gray-50"
              >
                DONATE VIA RAZORPAY
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
