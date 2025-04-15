export default function DownloadApp() {
    return (
        <section className="bg-gradient-to-r from-green-50 to-white py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Download the FoodRush App</h2>
            <p className="text-gray-600 max-w-md">
              Enjoy a smoother experience. Track your orders, get exclusive deals, and order in a few taps from your phone!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <a href="#" className="bg-black text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7C296.4 241.7 264.2 228 231.9 228s-65.6 13.6-87 40.5c-30.5 37.6-40.3 100.1-11.3 144.3 16.6 25.5 43.7 39.2 70.8 39.2 22.3 0 47.6-9.2 70.8-39.2 29-44.2 19.2-106.6-11.3-144.3zM224 32c-17.7 0-32 14.3-32 32v48h-48c-17.7 0-32 14.3-32 32v48h48v64h64v-64h48v-48c0-17.7-14.3-32-32-32h-48V64c0-17.7-14.3-32-32-32z"/></svg>
              App Store
            </a>
            <a href="#" className="bg-green-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 512 512"><path d="M325.3 234.3l-139-85.4 155.9-93.4c14.4-8.6 25.8-1.1 25.8 16.9v388.2c0 18-11.4 25.5-25.8 16.9l-155.9-93.4 139-85.4z"/></svg>
              Google Play
            </a>
          </div>
        </div>
      </section>
    );
}