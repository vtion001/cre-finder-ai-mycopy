const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-white">CRE Finder AI</div>
            <p className="mt-2 text-sm text-gray-300">
              Instantly find off-market commercial properties.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Blog (Coming Soon)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li />
              <li />
              <li>
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Demo (Coming Soon)
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} CRE Finder AI. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
