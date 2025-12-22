import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <img
        src="https://www.kheyo.com/wp-content/uploads/2024/09/03e017acthumbnail.jpeg"
        alt="Karigari"
        className="w-full h-[55vh] md:h-[75vh] object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
        <motion.div
          className="text-center text-white"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.25,
              },
            },
          }}
        >
          {/* Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-8xl font-bold tracking-tight uppercase"
          >
            Karigari
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-3 text-lg md:text-2xl tracking-tighter mb-6"
          >
            Handmade Crochet Creations
          </motion.p>

          {/* Button */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link
              to="#"
              className="inline-block bg-white text-gray-950 px-6 py-2 rounded-sm text-lg
                         hover:scale-105 transition-transform duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
