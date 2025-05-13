export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Select Your Target Market",
      description:
        "Choose the county and geographic area where you want to find investment properties.",
    },
    {
      number: "02",
      title: "Filter By Asset Type",
      description:
        "Specify what type of commercial real estate you're looking for - retail, office, industrial, or multifamily.",
    },
    {
      number: "03",
      title: "Review Instant Results",
      description:
        "Browse through properties that match your criteria, complete with key metrics and details.",
    },
    {
      number: "04",
      title: "Skip-Trace To Find Owners",
      description:
        "With one click, access property owner contact information to reach out directly.",
    },
  ];
  return (
    <section id="how-it-works" className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find commercial properties and contact owners in seconds, not
              months, with our streamlined 4-step process.
            </p>

            <div className="mt-10 space-y-10">
              {steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      <span className="font-bold">{step.number}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:col-span-7">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg mix-blend-multiply blur-xl opacity-50" />
              <div className="relative">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Property Search Workflow
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Step 1: Market Selection
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            Completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: "100%",
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Step 2: Asset Filtering
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            Completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: "100%",
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Step 3: Results Review
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            In Progress
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: "75%",
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Step 4: Owner Contact
                          </span>
                          <span className="text-sm font-medium text-gray-400">
                            Pending
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-300 h-2 rounded-full"
                            style={{
                              width: "0%",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3 text-sm text-blue-700">
                          <p>
                            Found 27 properties matching your criteria. Click on
                            any property to view details and contact the owner.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
