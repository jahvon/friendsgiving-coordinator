import Link from 'next/link';
import { Utensils, Calendar, MapPin, Users, Sparkles, ChefHat } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Main Invitation Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Decorative Header with Gradient */}
          <div className="bg-gradient-to-r from-warm-500 via-warm-400 to-terra-500 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
            </div>
            <Utensils className="w-16 h-16 mx-auto mb-4 text-white relative z-10" />
            <h1 className="font-display text-5xl font-bold text-white mb-3 relative z-10">
              You&apos;re Invited!
            </h1>
            <p className="font-display text-2xl text-cream-50 relative z-10">
              Jahvon&apos;s Friendsgiving
            </p>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <p className="text-center text-lg text-terra-700 mb-8 leading-relaxed">
              Join us for a wonderful feast filled with good food, great company, and warm memories
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center p-6 bg-sky-50 rounded-xl border border-sky-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="font-semibold text-lg text-terra-900 mb-2">When</h3>
                <p className="text-terra-700 text-center font-medium">Thursday, November 28th</p>
                <p className="text-terra-600 text-sm mt-1">6:00 PM</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-warm-50 rounded-xl border border-warm-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-7 h-7 text-warm-600" />
                </div>
                <h3 className="font-semibold text-lg text-terra-900 mb-2">Where</h3>
                <p className="text-terra-700 text-center font-medium">123 Harvest Lane</p>
                <p className="text-terra-600 text-sm mt-1">Oakland, CA</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-sage-50 rounded-xl border border-sage-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-sage-700" />
                </div>
                <h3 className="font-semibold text-lg text-terra-900 mb-2">Who</h3>
                <p className="text-terra-700 text-center font-medium">Friends & Family</p>
                <p className="text-terra-600 text-sm mt-1">~20 guests expected</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-full hover:from-warm-600 hover:to-warm-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold"
              >
                <ChefHat className="w-6 h-6" />
                RSVP & Choose Your Dish
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-warm-500" />
            <h2 className="font-display text-3xl font-semibold text-terra-900">How It Works</h2>
          </div>

          <ol className="space-y-6">
            <li className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                1
              </div>
              <div className="pt-1">
                <p className="font-semibold text-lg mb-1 text-terra-900">RSVP</p>
                <p className="text-terra-700 leading-relaxed">Tell us about your cooking skills and any dietary restrictions</p>
              </div>
            </li>

            <li className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-warm-400 to-warm-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                2
              </div>
              <div className="pt-1">
                <p className="font-semibold text-lg mb-1 text-terra-900">Get Suggestions</p>
                <p className="text-terra-700 leading-relaxed">Receive AI-powered recipe ideas tailored to your abilities, or bring your own specialty</p>
              </div>
            </li>

            <li className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                3
              </div>
              <div className="pt-1">
                <p className="font-semibold text-lg mb-1 text-terra-900">Claim Your Dishes</p>
                <p className="text-terra-700 leading-relaxed">Choose as many dishes as you&apos;d like to bring to the celebration</p>
              </div>
            </li>

            <li className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-terra-500 to-terra-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                4
              </div>
              <div className="pt-1">
                <p className="font-semibold text-lg mb-1 text-terra-900">Enjoy the Feast</p>
                <p className="text-terra-700 leading-relaxed">Join us for an amazing meal with perfect variety and balance</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Host Dashboard Link */}
        <div className="text-center py-2">
          <Link
            href="/dashboard"
            className="text-sm text-terra-600 hover:text-terra-800 underline opacity-70 hover:opacity-100 transition-opacity"
          >
            Host dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
