"use client";

import { Button } from "@v1/ui/button";
const CTASection = () => {
  return (
    <section className="bg-[#0072FF]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Sync to your counties in seconds
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-blue-100">
              Connect with commercial properties in seconds. CRE Finder AI gives
              you instant access to property data across all counties, with
              owner contact information and more.{" "}
            </p>

            <div className="mt-6 text-sm text-blue-100" />
          </div>
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Try CRE Finder AI Today
                  </h3>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">
                      $1
                    </span>
                    <span className="ml-1 text-xl font-medium text-gray-500">
                      /property
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">cancel anytime</p>
                </div>
                <div className="mt-6">
                  <Button
                    className="w-full bg-[#0072FF] hover:bg-[#0060CC]"
                    onClick={() =>
                      window.open("https://app.crefinder.ai/", "_blank")
                    }
                  >
                    Start Finding Properties
                  </Button>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <div className="text-xs text-gray-500 text-center">
                  Join 500+ real estate investors finding properties faster
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CTASection;
