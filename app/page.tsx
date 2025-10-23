import Link from 'next/link';
import { Utensils, Calendar, MapPin, Users, Sparkles, ChefHat, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Invitation Card */}
      <div className="bg-white shadow-xl rounded-xl p-10 border-4 border-harvest-400">
        <div className="text-center mb-8">
          <Utensils className="w-16 h-16 mx-auto mb-4 text-harvest-600" />
          <h2 className="text-4xl font-bold mb-4 text-harvest-900">
            You&apos;re Invited to Jahvon&apos;s Friendsgiving!
          </h2>
          <p className="text-xl text-harvest-700 mb-8">
            Join us for a wonderful feast with friends and family
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center p-6 bg-autumn-50 rounded-lg border-2 border-autumn-300">
            <Calendar className="w-12 h-12 mb-3 text-harvest-600" />
            <h3 className="font-bold text-lg text-harvest-900 mb-1">When</h3>
            <p className="text-harvest-700 text-center">Thursday, November 28th</p>
            <p className="text-harvest-600 text-sm">6:00 PM</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-autumn-50 rounded-lg border-2 border-autumn-300">
            <MapPin className="w-12 h-12 mb-3 text-harvest-600" />
            <h3 className="font-bold text-lg text-harvest-900 mb-1">Where</h3>
            <p className="text-harvest-700 text-center">123 Harvest Lane</p>
            <p className="text-harvest-600 text-sm">Oakland, CA</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-autumn-50 rounded-lg border-2 border-autumn-300">
            <Users className="w-12 h-12 mb-3 text-harvest-600" />
            <h3 className="font-bold text-lg text-harvest-900 mb-1">Who</h3>
            <p className="text-harvest-700 text-center">Friends & Family</p>
            <p className="text-harvest-600 text-sm">~20 guests expected</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-10 py-5 bg-harvest-600 text-white rounded-xl hover:bg-harvest-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xl font-bold"
          >
            <ChefHat className="w-6 h-6" />
            Sign Up & Choose Your Dish
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white shadow-xl rounded-xl p-8 border-2 border-autumn-200">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-harvest-600" />
          <h3 className="text-2xl font-bold text-harvest-900">How It Works</h3>
        </div>

        <ol className="space-y-5 text-harvest-800">
          <li className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-harvest-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div>
              <p className="font-semibold text-lg mb-1 text-harvest-900">Sign Up</p>
              <p className="text-harvest-700">Tell us about your cooking skills and any dietary restrictions</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-harvest-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div>
              <p className="font-semibold text-lg mb-1 text-harvest-900">Get Suggestions</p>
              <p className="text-harvest-700">Receive AI-powered recipe ideas tailored to your abilities, or bring your own specialty</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-harvest-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div>
              <p className="font-semibold text-lg mb-1 text-harvest-900">Claim Your Dishes</p>
              <p className="text-harvest-700">Choose as many dishes as you&apos;d like to bring to the celebration</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-harvest-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div>
              <p className="font-semibold text-lg mb-1 text-harvest-900">Enjoy the Feast</p>
              <p className="text-harvest-700">Join us for an amazing meal with perfect variety and balance</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Host Dashboard Link */}
      <div className="text-center py-4">
        <Link
          href="/dashboard"
          className="text-sm text-harvest-700 hover:text-harvest-800 underline"
        >
          Host dashboard
        </Link>
      </div>
    </div>
  );
}
