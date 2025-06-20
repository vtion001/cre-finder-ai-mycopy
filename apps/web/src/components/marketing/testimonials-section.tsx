import { Card, CardContent } from "@v1/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      content:
        "REIFinder has completely transformed our property acquisition process. What used to take us 6-8 weeks now happens in minutes. We've closed 3 deals in the last month alone using the platform.",
      author: "Michael J.",
      role: "Principal, MJ Investment Partners",
      avatar:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' fill='%23BFDBFE'/%3E%3Cpath d='M24 11C17.9249 11 13 15.9249 13 22C13 25.2341 14.2834 28.1323 16.3333 30.1367C16.5251 30.3146 16.6663 30.5438 16.7573 30.772C17.4439 32.1373 19.5267 35.7189 24 37C28.4733 35.7189 30.5561 32.1373 31.2427 30.772C31.3337 30.5438 31.4749 30.3146 31.6667 30.1367C33.7166 28.1323 35 25.2341 35 22C35 15.9249 30.0751 11 24 11Z' fill='%233B82F6'/%3E%3C/svg%3E",
      stars: 5,
    },
    {
      content:
        "The skip-tracing feature paid for itself on our very first deal. We found a struggling retail property, contacted the owner directly, and closed an off-market deal at 15% below market value.",
      author: "Sarah L.",
      role: "Director of Acquisitions, Prominence CRE",
      avatar:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' fill='%23FEE2E2'/%3E%3Cpath d='M24 11C17.9249 11 13 15.9249 13 22C13 25.2341 14.2834 28.1323 16.3333 30.1367C16.5251 30.3146 16.6663 30.5438 16.7573 30.772C17.4439 32.1373 19.5267 35.7189 24 37C28.4733 35.7189 30.5561 32.1373 31.2427 30.772C31.3337 30.5438 31.4749 30.3146 31.6667 30.1367C33.7166 28.1323 35 25.2341 35 22C35 15.9249 30.0751 11 24 11Z' fill='%23EF4444'/%3E%3C/svg%3E",
      stars: 5,
    },
    {
      content:
        "As an institutional investor, we needed a solution to scale our property search across multiple counties. REIFinder's enterprise solution has given us a significant edge in identifying opportunities before our competitors.",
      author: "David T.",
      role: "Managing Director, Blackrock Capital",
      avatar:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' fill='%23D1FAE5'/%3E%3Cpath d='M24 11C17.9249 11 13 15.9249 13 22C13 25.2341 14.2834 28.1323 16.3333 30.1367C16.5251 30.3146 16.6663 30.5438 16.7573 30.772C17.4439 32.1373 19.5267 35.7189 24 37C28.4733 35.7189 30.5561 32.1373 31.2427 30.772C31.3337 30.5438 31.4749 30.3146 31.6667 30.1367C33.7166 28.1323 35 25.2341 35 22C35 15.9249 30.0751 11 24 11Z' fill='%2310B981'/%3E%3C/svg%3E",
      stars: 4,
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by Real Estate Investors
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
            See what our clients have to say about their experience with our
            platform.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border border-gray-200 animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  {[...Array(5 - testimonial.stars)].map((_, i) => (
                    <svg
                      key={i + testimonial.stars}
                      className="h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={testimonial.avatar}
                    alt={testimonial.author}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
