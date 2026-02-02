import { HiHeart, HiColorSwatch, HiTruck, HiSparkles } from "react-icons/hi";

const features = [
  {
    icon: <HiHeart className="text-2xl" />,
    title: "Handmade with Love",
    desc: "Each crochet item is carefully handcrafted with attention to detail.",
  },
  {
    icon: <HiColorSwatch className="text-2xl" />,
    title: "Custom Orders",
    desc: "Choose your colors, size, and style – we make it just for you.",
  },
  {
    icon: <HiTruck className="text-2xl" />,
    title: "Free Shipping",
    desc: "Free delivery on all orders above ₹1000 across India.",
  },
  {
    icon: <HiSparkles className="text-2xl" />,
    title: "Premium Yarn",
    desc: "We use soft, skin-friendly and eco-conscious yarn materials.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">

        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            
            <div className="p-4 rounded-full bg-pink-100 text-pink-600 mb-4">
              {feature.icon}
            </div>

            <h4 className="text-lg font-semibold mb-2 tracking-tight">
              {feature.title}
            </h4>

            <p className="text-gray-600 text-sm">
              {feature.desc}
            </p>

          </div>
        ))}

      </div>
    </section>
  );
};

export default FeaturesSection;
