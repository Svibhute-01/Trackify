import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBus,
  FaClock,
  FaMapMarkerAlt
} from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT */}
        <div className="animate-slideUp">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-400 text-green-300 px-4 py-1 rounded-full text-xs animate-fadeIn">
            ● Live Tracking Enabled
          </div>

     
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          <span className="block text-white">
            Track buses
          </span>

          <span className="block text-blue-400">
            in real-time
          </span>

          <span className="block text-gray-300">
            never miss your ride
          </span>
        </h1>

          <p className="mt-4 text-gray-300 max-w-lg">
            Live GPS tracking, smart scheduling, and easy travel planning —
            everything you need in one place.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              to="/search"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Explore Buses <FaArrowRight />
            </Link>

            <Link
              to="/about"
              className="border border-gray-600 hover:bg-gray-800 px-6 py-3 rounded-lg transition"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-10 flex gap-10">
            <div>
              <h3 className="text-xl font-bold text-blue-400">100+</h3>
              <p className="text-gray-400 text-sm">Buses</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400">50+</h3>
              <p className="text-gray-400 text-sm">Routes</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400">24/7</h3>
              <p className="text-gray-400 text-sm">Tracking</p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg animate-slideUp">
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <FaBus />
              </div>
              <div>
                <p className="font-semibold">Route 24A</p>
                <p className="text-gray-400 text-sm">Express</p>
              </div>
            </div>

            <span className="text-green-400 text-sm font-medium">
              ● Live
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex gap-3 items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <div>
                <p className="text-gray-400 text-xs">From</p>
                <p>Downtown</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <FaMapMarkerAlt className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-xs">To</p>
                <p>Airport</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-400">
                <FaClock /> Arriving
              </span>
              <span className="font-bold text-lg text-white">4 min</span>
            </div>

            <div className="mt-3 h-2 bg-gray-700 rounded-full">
              <div className="h-2 w-2/3 bg-blue-500 rounded-full"></div>
            </div>

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>3 stops away</span>
              <span>On time</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;