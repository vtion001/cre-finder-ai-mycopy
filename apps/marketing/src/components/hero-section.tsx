"use client";

import { Button } from "@v1/ui/button";
import { Input } from "@v1/ui/input";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="text-center lg:text-left md:max-w-2xl md:mx-auto lg:mx-0">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Find Off-Market Commercial</span>{" "}
                <span className="block text-[#0072ff]">
                  Properties in Seconds
                </span>
              </h1>
              <p className="mt-3 text-base text-slate-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Skip the painful search process! Instantly discover and filter
                commercial real estate properties by asset type and county, with
                skip-traced owner contact information.
              </p>

              <div className="mt-6 text-sm text-slate-600" />
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7 relative">
            <div className="animate-fade-in opacity-0 animation-delay-200 shadow-xl rounded-lg overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-lg mix-blend-multiply blur-xl" />
                <div className="relative bg-white p-4 rounded-lg border border-gray-200 shadow-lg">
                  <div className="rounded-md bg-white overflow-hidden shadow">
                    <div className="px-4 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-700">
                        CRE Finder AI Dashboard Demo
                      </h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Asset Type
                          </label>
                          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                            <option>Retail</option>
                            <option>Office</option>
                            <option>Industrial</option>
                            <option>Multifamily</option>
                            <option>Hospitality</option>
                            <option>Land</option>
                            <option>Mixed-Use</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">
                            City/County
                          </label>
                          <Input
                            className="mt-1 block w-full py-2 text-base border-gray-300"
                            placeholder="Enter county name"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          className="w-full bg-[#0072ff]"
                          onClick={() =>
                            window.open(
                              "https://app.crefinder.ai/dashboard/search",
                              "_blank",
                            )
                          }
                        >
                          Find Properties
                        </Button>
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
  );
};

export default HeroSection;
