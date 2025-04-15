import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function StatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
    delay: 100
  });

  const stats = [
    { label: 'Happy Customers', end: 25000 },
    { label: 'Restaurants', end: 1200 },
    { label: 'Deliveries Made', end: 450000 },
    { label: 'Cities Served', end: 35 }
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">Trusted by Thousands</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="text-4xl font-bold text-green-600">
                {inView ? (
                  <CountUp end={stat.end} duration={1.2} separator="," delay={0.1} />
                ) : (
                  0
                )}
              </h3>
              <p className="text-sm mt-2 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
