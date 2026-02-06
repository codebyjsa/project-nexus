import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-16 px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              Project Nexus
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your all-in-one student platform for campus life
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/exchange"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              🚀 Go to Student Exchange Hub
            </Link>
          </div>

          <div className="mt-16 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Student Exchange Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-semibold text-gray-900 mb-1">Lost & Found</h3>
                <p className="text-sm text-gray-600">
                  Report and find lost items on campus
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl mb-2">🛒</div>
                <h3 className="font-semibold text-gray-900 mb-1">Marketplace</h3>
                <p className="text-sm text-gray-600">
                  Buy and sell items within the community
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-2xl mb-2">🚗</div>
                <h3 className="font-semibold text-gray-900 mb-1">Cab Pool</h3>
                <p className="text-sm text-gray-600">
                  Share rides and split travel costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

