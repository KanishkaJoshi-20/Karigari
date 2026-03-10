import { FaYarn, FaHandHoldingHeart, FaLeaf } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Karigari</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Handcrafted with love — every stitch tells a story.
        </p>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Karigari was born from a passion for the art of crochet. What started as a hobby — making small toys and flowers for friends and family — quickly grew into a mission to bring handcrafted, artisan-quality crochet products to everyone.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          The word <strong>"Karigari"</strong> means craftsmanship in Hindi. We believe that in a world of mass production, there's something truly special about owning a piece that was made by hand, stitch by stitch, with care and intention.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Every product in our collection is handmade using premium yarns and materials. From adorable amigurumi toys to elegant home décor, each piece carries the warmth and soul of the artisan who created it.
        </p>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-4">
                <FaYarn className="text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Handmade</h3>
              <p className="text-gray-500 text-sm">Every product is crocheted by hand — no machines, no shortcuts.</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-500 mb-4">
                <FaHandHoldingHeart className="text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Made With Love</h3>
              <p className="text-gray-500 text-sm">We pour care and creativity into every stitch. Each piece is unique.</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-4">
                <FaLeaf className="text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Eco-Friendly</h3>
              <p className="text-gray-500 text-sm">We use sustainable materials and minimal packaging wherever possible.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
