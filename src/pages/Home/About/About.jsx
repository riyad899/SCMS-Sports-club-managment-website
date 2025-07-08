import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const About = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) {
      setStartCount(true);
    }
  }, [inView]);

  return (
    <section className="bg-white py-16 px-4 md:px-12 lg:px-24" id="about">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#162E50] mb-4">
            About Our Club
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            We are more than just a sports facility — we’re a community focused
            on fitness, friendship, and excellence.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Info */}
          <div>
            <h3 className="text-2xl font-semibold text-[#162E50] mb-4">
              Our History
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Established in 2014, our club has grown from a small community
              group into one of the region’s leading sports hubs. With premium
              facilities and expert trainers, we’ve created a space for all age
              groups to thrive physically and mentally.
            </p>

            <h3 className="text-2xl font-semibold text-[#162E50] mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To inspire health and wellness through inclusive, accessible, and
              high-quality sports experiences for everyone. We’re committed to
              building a positive community through sportsmanship and teamwork.
            </p>
          </div>

          {/* Right: Stats */}
          <div ref={ref} className="grid grid-cols-2 gap-6">
            {/* Each Counter */}
            <div className="bg-[#162E50] text-white p-6 rounded-lg text-center shadow-lg">
              <h3 className="text-4xl font-bold">
                {startCount && <CountUp end={5000} duration={2} />}+
              </h3>
              <p className="mt-2 text-lg">Happy Members</p>
            </div>
            <div className="bg-[#162E50] text-white p-6 rounded-lg text-center shadow-lg">
              <h3 className="text-4xl font-bold">
                {startCount && <CountUp end={10} duration={2} />}+
              </h3>
              <p className="mt-2 text-lg">Years of Excellence</p>
            </div>
            <div className="bg-[#162E50] text-white p-6 rounded-lg text-center shadow-lg">
              <h3 className="text-4xl font-bold">
                {startCount && <CountUp end={25} duration={2} />}+
              </h3>
              <p className="mt-2 text-lg">Certified Coaches</p>
            </div>
            <div className="bg-[#162E50] text-white p-6 rounded-lg text-center shadow-lg">
              <h3 className="text-4xl font-bold">
                {startCount && <CountUp end={100} duration={2} />}+
              </h3>
              <p className="mt-2 text-lg">Weekly Sessions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
