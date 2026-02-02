import { Link } from "react-router-dom";
import featured from "/productImg/Sunflower2.jpeg";

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-[#F5EFE6] rounded-3xl">

        {/* Left Content */}
        <div className="lg:w-1/2 p-10 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-[#7A5C42] mb-2">
            Handcrafted with Love
          </h2>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[#2B1E16]">
            Celebrate Indian Art & Karigari
          </h2>

          <p className="text-lg text-[#5A4636] mb-8">
            Discover beautifully handcrafted products made by skilled artisans.
            Each piece tells a story of tradition, culture, and timeless craftsmanship —
            made to bring authenticity and warmth into your everyday spaces.
          </p>

          <Link
            to="/collections/all"
            className="bg-[#2B1E16] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#1E150F] transition"
          >
            Explore Collection
          </Link>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 flex justify-center items-center p-8">
          <img
            src={featured}
            alt="Karigari Featured Collection"
            className="w-[80%] max-w-md object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollection;
