'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { success as playSuccess, impact, scan, glitch } from '@/lib/audio/procedural'

// ─── Types ──────────────────────────────────────────────────────────

interface DarkPattern {
  id: string
  label: string
  explanation: string
  category: string
}

interface MockupData {
  id: string
  title: string
  subtitle: string
  url: string
  patterns: DarkPattern[]
  component: React.ComponentType<MockupProps>
}

interface MockupProps {
  patterns: DarkPattern[]
  found: Set<string>
  onPatternClick: (id: string) => void
  onWrongClick: (e: React.MouseEvent) => void
}

interface WrongClickFeedback {
  x: number
  y: number
  id: number
}

// ─── Mockup 1: Cookie Banner ────────────────────────────────────────

function CookieBannerMockup({ patterns, found, onPatternClick, onWrongClick }: MockupProps) {
  return (
    <div className="bg-white min-h-[480px] flex flex-col text-gray-800 overflow-x-hidden" onClick={onWrongClick}>
      {/* Fake website content behind */}
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-4/5 mb-6" />
          <div className="h-32 bg-gray-200 rounded mb-4" />
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>
      </div>

      {/* Cookie overlay */}
      <div className="bg-white border-t-2 border-gray-200 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="max-w-xl mx-auto">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
            We value your privacy
          </h3>
          <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
            We and our partners use cookies and similar technologies to provide, protect, and improve
            our services. By clicking &quot;Accept All&quot; you consent to the use of cookies for analytics,
            personalization, and advertising purposes.
          </p>

          {/* Checkboxes */}
          <div className="mb-4 space-y-2">
            <label className="flex items-center gap-2 text-[11px] text-gray-600">
              <input type="checkbox" checked disabled className="accent-blue-500 w-3.5 h-3.5" readOnly />
              <span>Strictly Necessary (Required)</span>
            </label>
            <label className="flex items-center gap-2 text-[11px] text-gray-600">
              <input type="checkbox" checked disabled className="accent-blue-500 w-3.5 h-3.5" readOnly />
              <span>Performance & Analytics</span>
            </label>
            {/* DARK PATTERN: Pre-checked sharing box */}
            <label
              className={`flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer relative
                ${found.has('cookie-prechecked') ? 'ring-2 ring-green-500 rounded bg-green-50 px-1 py-0.5' : ''}`}
              onClick={(e) => { e.stopPropagation(); onPatternClick('cookie-prechecked') }}
            >
              <input type="checkbox" checked disabled className="accent-blue-500 w-3.5 h-3.5" readOnly />
              <span>Share data with 847 advertising partners</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {/* DARK PATTERN: Huge accept button */}
            <button
              className={`flex-1 bg-blue-600 text-white text-[14px] font-semibold py-3.5 px-6 rounded-lg
                shadow-lg hover:bg-blue-700 transition-colors cursor-pointer relative
                ${found.has('cookie-accept-size') ? 'ring-2 ring-green-500' : ''}`}
              onClick={(e) => { e.stopPropagation(); onPatternClick('cookie-accept-size') }}
            >
              Accept All Cookies
            </button>

            {/* DARK PATTERN: Tiny manage preferences */}
            <span
              className={`text-[10px] text-gray-400 underline cursor-pointer whitespace-nowrap hover:text-gray-500 relative min-h-[44px] inline-flex items-center px-2
                ${found.has('cookie-tiny-reject') ? 'ring-2 ring-green-500 rounded bg-green-50 text-green-700' : ''}`}
              onClick={(e) => { e.stopPropagation(); onPatternClick('cookie-tiny-reject') }}
            >
              Manage Preferences
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Mockup 2: Subscription Cancel ─────────────────────────────────

function SubscriptionCancelMockup({ patterns, found, onPatternClick, onWrongClick }: MockupProps) {
  return (
    <div className="bg-gray-50 min-h-[480px] flex items-center justify-center p-4 overflow-x-hidden" onClick={onWrongClick}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {/* Sad face icon */}
        <div className="w-20 h-20 mx-auto mb-5 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">&#128546;</span>
        </div>

        {/* DARK PATTERN: Guilt trip headline */}
        <h2
          className={`text-xl font-bold text-gray-900 mb-2 cursor-pointer relative
            ${found.has('cancel-guilt') ? 'ring-2 ring-green-500 rounded bg-green-50 px-2' : ''}`}
          onClick={(e) => { e.stopPropagation(); onPatternClick('cancel-guilt') }}
        >
          Are you sure? You&apos;ll lose everything!
        </h2>

        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
          Your Premium membership includes exclusive features that 2.3 million members love.
          Once cancelled, your saved playlists, preferences, and history will be permanently deleted.
        </p>

        {/* Benefits list */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-[12px] font-semibold text-orange-800 mb-2">You&apos;ll lose access to:</p>
          <ul className="text-[11px] text-orange-700 space-y-1">
            <li className="flex items-center gap-2"><span className="text-red-500">&#10007;</span> Ad-free experience</li>
            <li className="flex items-center gap-2"><span className="text-red-500">&#10007;</span> Offline downloads (143 items saved)</li>
            <li className="flex items-center gap-2"><span className="text-red-500">&#10007;</span> Premium-only content library</li>
            <li className="flex items-center gap-2"><span className="text-red-500">&#10007;</span> Priority customer support</li>
          </ul>
        </div>

        {/* DARK PATTERN: Big keep button */}
        <button
          className={`w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-6
            rounded-xl shadow-lg text-[15px] mb-3 cursor-pointer relative
            ${found.has('cancel-keep-big') ? 'ring-2 ring-green-500' : ''}`}
          onClick={(e) => { e.stopPropagation(); onPatternClick('cancel-keep-big') }}
        >
          KEEP MY PREMIUM MEMBERSHIP
        </button>

        {/* DARK PATTERN: Confirmshaming cancel link */}
        <p
          className={`text-[10px] text-gray-400 cursor-pointer hover:text-gray-500 relative min-h-[44px] flex items-center justify-center
            ${found.has('cancel-confirmshame') ? 'ring-2 ring-green-500 rounded bg-green-50 px-2 py-1 text-green-700' : ''}`}
          onClick={(e) => { e.stopPropagation(); onPatternClick('cancel-confirmshame') }}
        >
          No thanks, I don&apos;t want to save money and enjoy premium features
        </p>
      </div>
    </div>
  )
}

// ─── Mockup 3: E-commerce Checkout ──────────────────────────────────

function EcommerceCheckoutMockup({ patterns, found, onPatternClick, onWrongClick }: MockupProps) {
  const [timerDisplay] = useState('14:32')

  return (
    <div className="bg-gray-100 min-h-[480px] p-4 overflow-x-hidden" onClick={onWrongClick}>
      <div className="max-w-lg mx-auto">
        {/* Product card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-3">
          <div className="flex gap-4 p-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
              <span className="text-3xl">&#128187;</span>
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold text-gray-900">
                ProTech Wireless Headphones X500
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400 text-[11px]">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
                <span className="text-[10px] text-gray-400">(2,847 reviews)</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-[18px] font-bold text-gray-900">$79.99</span>
                <span className="text-[12px] text-gray-400 line-through">$129.99</span>
                <span className="text-[11px] text-red-600 font-semibold">-38%</span>
              </div>
            </div>
          </div>

          {/* DARK PATTERN: Fake scarcity */}
          <div
            className={`mx-4 mb-2 px-3 py-1.5 bg-red-50 rounded text-[11px] text-red-700 font-medium
              flex items-center gap-1.5 cursor-pointer relative
              ${found.has('ecom-scarcity') ? 'ring-2 ring-green-500 bg-green-50 text-green-700' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('ecom-scarcity') }}
          >
            <span className="text-red-500 animate-pulse">&#9679;</span>
            Only 2 left in stock! — 47 people are viewing this right now
          </div>

          {/* DARK PATTERN: Countdown timer */}
          <div
            className={`mx-4 mb-3 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-[11px]
              text-yellow-800 flex items-center gap-2 cursor-pointer relative
              ${found.has('ecom-timer') ? 'ring-2 ring-green-500 bg-green-50 text-green-700 border-green-300' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('ecom-timer') }}
          >
            <span className="font-mono font-bold text-[13px] text-red-600">{timerDisplay}</span>
            <span>Deal expires soon! Order now to lock in this price.</span>
          </div>
        </div>

        {/* Checkout extras */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Order Summary</h4>

          <div className="space-y-2 text-[12px] text-gray-600 mb-3">
            <div className="flex justify-between">
              <span>ProTech Headphones X500</span>
              <span>$79.99</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
          </div>

          {/* DARK PATTERN: Sneaked-in protection plan */}
          <label
            className={`flex items-start gap-2.5 p-3 bg-blue-50 rounded-lg mb-3 cursor-pointer relative
              ${found.has('ecom-sneaked') ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('ecom-sneaked') }}
          >
            <input type="checkbox" checked className="accent-blue-500 w-3.5 h-3.5 mt-0.5" readOnly />
            <div>
              <span className="text-[11px] font-medium text-gray-800">
                Add AccidentShield Protection Plan
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Covers drops, spills &amp; malfunctions for 2 years — only $4.99/mo
              </p>
            </div>
          </label>

          <div className="border-t border-gray-100 pt-3 flex justify-between text-[14px] font-bold text-gray-900">
            <span>Total</span>
            <span>$84.98</span>
          </div>

          <button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg text-[14px] transition-colors">
            Place Order &#8594;
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Mockup 4: Social Media Notifications ───────────────────────────

function SocialNotificationsMockup({ patterns, found, onPatternClick, onWrongClick }: MockupProps) {
  return (
    <div className="bg-white min-h-[480px] p-4 overflow-x-hidden" onClick={onWrongClick}>
      <div className="max-w-md mx-auto">
        {/* App header */}
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
          <button className="text-gray-400 text-[18px]">&#8592;</button>
          <h2 className="text-[16px] font-semibold text-gray-900">Notification Settings</h2>
        </div>

        <p className="text-[12px] text-gray-500 mb-5">
          Choose which notifications you&apos;d like to receive. We recommend keeping all notifications
          enabled for the best experience.
        </p>

        {/* Notification toggles */}
        <div className="space-y-1">
          {/* Normal toggle */}
          <div className="flex items-center justify-between py-3 px-2">
            <div>
              <p className="text-[13px] text-gray-800 font-medium">Direct Messages</p>
              <p className="text-[10px] text-gray-400">When someone sends you a message</p>
            </div>
            <div className="w-11 h-6 bg-blue-500 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
            </div>
          </div>

          {/* DARK PATTERN: All defaults ON */}
          <div
            className={`flex items-center justify-between py-3 px-2 cursor-pointer rounded relative
              ${found.has('notif-defaults') ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('notif-defaults') }}
          >
            <div>
              <p className="text-[13px] text-gray-800 font-medium">Marketing Emails</p>
              <p className="text-[10px] text-gray-400">Product updates, tips, and special offers</p>
            </div>
            <div className="w-11 h-6 bg-blue-500 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-2">
            <div>
              <p className="text-[13px] text-gray-800 font-medium">Friend Activity</p>
              <p className="text-[10px] text-gray-400">When friends post, comment, or go live</p>
            </div>
            <div className="w-11 h-6 bg-blue-500 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
            </div>
          </div>

          {/* DARK PATTERN: Guilt trip on disable */}
          <div
            className={`py-3 px-2 cursor-pointer rounded relative
              ${found.has('notif-guilt') ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('notif-guilt') }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-gray-800 font-medium">Push Notifications</p>
                <p className="text-[10px] text-gray-400">Real-time alerts on your device</p>
              </div>
              <div className="w-11 h-6 bg-blue-500 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </div>
            <div className="mt-2 p-2.5 bg-amber-50 rounded text-[10px] text-amber-700 border border-amber-100">
              &#9888; Turning off push notifications means you might miss important updates from friends and
              time-sensitive content. Are you sure?
            </div>
          </div>

          {/* DARK PATTERN: Double negative */}
          <div
            className={`py-3 px-2 cursor-pointer rounded relative
              ${found.has('notif-doublenegative') ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('notif-doublenegative') }}
          >
            <label className="flex items-start gap-2.5">
              <input type="checkbox" className="accent-blue-500 w-3.5 h-3.5 mt-0.5" readOnly />
              <span className="text-[11px] text-gray-600 leading-relaxed">
                Uncheck this box if you would prefer not to not receive non-essential
                third-party partner communications and promotional materials
              </span>
            </label>
          </div>
        </div>

        <button className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg text-[13px] font-semibold">
          Save Preferences
        </button>
      </div>
    </div>
  )
}

// ─── Mockup 5: Free Trial Signup ────────────────────────────────────

function FreeTrialMockup({ patterns, found, onPatternClick, onWrongClick }: MockupProps) {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-[480px] flex items-center justify-center p-4 overflow-x-hidden" onClick={onWrongClick}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-center text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl">&#9830;</span>
          </div>
          {/* DARK PATTERN: Huge FREE emphasis */}
          <h2
            className={`text-2xl font-bold mb-1 cursor-pointer relative
              ${found.has('trial-free-emphasis') ? 'ring-2 ring-green-400 rounded px-2' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('trial-free-emphasis') }}
          >
            Start Your <span className="text-yellow-300 text-3xl">FREE</span> Trial
          </h2>
          <p className="text-purple-100 text-[12px]">
            Get unlimited access to all premium features
          </p>
        </div>

        <div className="p-6">
          {/* Form fields */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-[11px] text-gray-500 font-medium">Email</label>
              <div className="mt-1 h-10 border border-gray-200 rounded-lg bg-gray-50 px-3 flex items-center text-[12px] text-gray-400">
                you@email.com
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 font-medium">Password</label>
              <div className="mt-1 h-10 border border-gray-200 rounded-lg bg-gray-50 px-3 flex items-center text-[12px] text-gray-400">
                &#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;
              </div>
            </div>

            {/* DARK PATTERN: Credit card required for "free" trial */}
            <div
              className={`cursor-pointer relative
                ${found.has('trial-cc-required') ? 'ring-2 ring-green-500 rounded bg-green-50 p-1' : ''}`}
              onClick={(e) => { e.stopPropagation(); onPatternClick('trial-cc-required') }}
            >
              <label className="text-[11px] text-gray-500 font-medium">Credit Card Number</label>
              <div className="mt-1 h-10 border border-gray-200 rounded-lg bg-gray-50 px-3 flex items-center text-[12px] text-gray-400 justify-between">
                <span>4242 &#8226;&#8226;&#8226;&#8226; &#8226;&#8226;&#8226;&#8226; &#8226;&#8226;&#8226;&#8226;</span>
                <span className="text-[10px] text-gray-300">VISA</span>
              </div>
              <p className="text-[9px] text-gray-400 mt-1 italic">Required to verify your identity</p>
            </div>
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-[14px] shadow-lg transition-colors">
            Start Free Trial &#8594;
          </button>

          {/* DARK PATTERN: Hidden auto-renewal */}
          <p
            className={`mt-3 text-[8px] text-gray-300 text-center leading-relaxed cursor-pointer relative min-h-[44px] flex items-center
              ${found.has('trial-autorenew') ? 'ring-2 ring-green-500 rounded bg-green-50 text-green-700 p-1' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPatternClick('trial-autorenew') }}
          >
            By clicking &quot;Start Free Trial&quot; you agree to our Terms of Service. Your free trial lasts 7
            days. After the trial period ends, your credit card will be automatically charged $29.99/month.
            Cancel anytime before the trial ends to avoid charges.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Mockup Definitions ─────────────────────────────────────────────

const MOCKUPS: MockupData[] = [
  {
    id: 'cookie-banner',
    title: 'Cookie Consent Banner',
    subtitle: 'news-daily.com',
    url: 'https://www.news-daily.com/article/top-stories',
    patterns: [
      {
        id: 'cookie-accept-size',
        label: 'Visual Hierarchy Manipulation',
        explanation: 'The "Accept All" button is massive and colorful, while the reject/manage option is a tiny, gray text link. This visual imbalance steers users toward accepting all cookies by making the alternative nearly invisible.',
        category: 'Interface Interference',
      },
      {
        id: 'cookie-tiny-reject',
        label: 'Hidden Reject Option',
        explanation: '"Manage Preferences" is styled as a tiny, low-contrast text link instead of an equally prominent button. The EU GDPR requires that rejecting cookies must be as easy as accepting them. This design deliberately violates that principle.',
        category: 'Obstruction',
      },
      {
        id: 'cookie-prechecked',
        label: 'Pre-selected Consent',
        explanation: '"Share data with 847 advertising partners" is pre-checked. Users must actively opt OUT rather than opt in, which reverses the consent model. Most users never notice pre-checked boxes, resulting in unknowing consent to mass data sharing.',
        category: 'Forced Action',
      },
    ],
    component: CookieBannerMockup,
  },
  {
    id: 'subscription-cancel',
    title: 'Subscription Cancellation',
    subtitle: 'streamplus.com',
    url: 'https://account.streamplus.com/membership/cancel',
    patterns: [
      {
        id: 'cancel-guilt',
        label: 'Emotional Manipulation',
        explanation: '"You\'ll lose everything!" creates fear and anxiety about cancelling. This emotionally charged language is designed to trigger loss aversion — a cognitive bias where the pain of losing something feels twice as powerful as the pleasure of gaining it.',
        category: 'Confirmshaming',
      },
      {
        id: 'cancel-keep-big',
        label: 'Visual Hierarchy Manipulation',
        explanation: 'The "KEEP MY PREMIUM" button is huge, colorful, and eye-catching, while the actual cancel option is buried below. The design makes the desired action (keeping the subscription) look like the only real option.',
        category: 'Interface Interference',
      },
      {
        id: 'cancel-confirmshame',
        label: 'Confirmshaming',
        explanation: '"No thanks, I don\'t want to save money and enjoy premium features" — this is textbook confirmshaming. Instead of a neutral "Cancel subscription" option, the cancel link is phrased as a self-deprecating statement designed to make users feel foolish for leaving.',
        category: 'Confirmshaming',
      },
    ],
    component: SubscriptionCancelMockup,
  },
  {
    id: 'ecommerce-checkout',
    title: 'Shopping Checkout',
    subtitle: 'megashop.com',
    url: 'https://www.megashop.com/checkout',
    patterns: [
      {
        id: 'ecom-scarcity',
        label: 'Fake Scarcity & Social Proof',
        explanation: '"Only 2 left!" and "47 people viewing" create artificial urgency through manufactured scarcity and fake social proof. These numbers are often fabricated or grossly exaggerated to pressure users into impulse purchasing before they can comparison shop.',
        category: 'Urgency',
      },
      {
        id: 'ecom-timer',
        label: 'Fake Countdown Timer',
        explanation: 'The countdown timer creates time pressure, but this "deal" often resets when it expires. The timer exists solely to trigger anxiety-driven impulse purchases. Research shows countdown timers increase conversion by 8.6% — by exploiting fear, not by offering genuine value.',
        category: 'Urgency',
      },
      {
        id: 'ecom-sneaked',
        label: 'Sneaking / Pre-selected Add-on',
        explanation: 'A $4.99/month protection plan has been pre-checked and added to the order without the user actively choosing it. This "sneak into basket" pattern adds unexpected charges and relies on users not noticing the pre-selected checkbox.',
        category: 'Sneaking',
      },
    ],
    component: EcommerceCheckoutMockup,
  },
  {
    id: 'social-notifications',
    title: 'Notification Settings',
    subtitle: 'socialapp.com',
    url: 'https://www.socialapp.com/settings/notifications',
    patterns: [
      {
        id: 'notif-defaults',
        label: 'Dark Defaults',
        explanation: 'All notification toggles — including marketing emails — are ON by default. This "Privacy Zuckering" pattern uses default settings to maximize data collection and engagement. Most users never change defaults, so the company ensures maximum notification bombardment.',
        category: 'Forced Action',
      },
      {
        id: 'notif-guilt',
        label: 'Guilt-Trip Warning',
        explanation: 'The warning "you might miss important updates from friends" appears when users try to disable push notifications. This guilt-trip message frames the user\'s privacy choice as a social failure, leveraging FOMO (Fear Of Missing Out) to prevent opt-out.',
        category: 'Confirmshaming',
      },
      {
        id: 'notif-doublenegative',
        label: 'Confusing Double Negative',
        explanation: '"Uncheck if you would prefer not to not receive non-essential communications" — this deliberately confusing triple-negative sentence makes it nearly impossible to understand what checking or unchecking the box actually does. This linguistic obfuscation is designed to prevent informed consent.',
        category: 'Trick Wording',
      },
    ],
    component: SocialNotificationsMockup,
  },
  {
    id: 'free-trial',
    title: 'Free Trial Signup',
    subtitle: 'cloudpro.io',
    url: 'https://www.cloudpro.io/signup/trial',
    patterns: [
      {
        id: 'trial-free-emphasis',
        label: 'Misleading "Free" Emphasis',
        explanation: '"FREE" is displayed in oversized, highlighted text to dominate the user\'s attention. This visual emphasis on "free" distracts from the fact that a credit card is required and the trial auto-converts to a $29.99/month paid plan. The word "free" does heavy psychological lifting here.',
        category: 'Misdirection',
      },
      {
        id: 'trial-cc-required',
        label: 'Forced Credit Card for "Free" Trial',
        explanation: 'Requiring a credit card for a "free" trial is a well-documented dark pattern. The company knows most users will forget to cancel before the trial ends. Research shows 48% of users who sign up for free trials with credit cards end up being charged unintentionally.',
        category: 'Forced Action',
      },
      {
        id: 'trial-autorenew',
        label: 'Hidden Auto-Renewal Terms',
        explanation: 'The auto-renewal at $29.99/month is buried in 8px light gray text at the very bottom. This critical billing information is deliberately made nearly invisible. The visual hierarchy ensures the "FREE" headline gets attention while the actual cost is hidden in the fine print.',
        category: 'Hidden Information',
      },
    ],
    component: FreeTrialMockup,
  },
]

// ─── Main Component ─────────────────────────────────────────────────

interface DarkPatternHuntProps {
  onComplete?: (score: number, findings: number, totalPatterns: number) => void
  onEvidenceAdd?: (evidence: { type: string; data: unknown }) => void
}

export function DarkPatternHunt({ onComplete, onEvidenceAdd }: DarkPatternHuntProps) {
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0)
  const [foundPatterns, setFoundPatterns] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState<DarkPattern | null>(null)
  const [wrongClicks, setWrongClicks] = useState<WrongClickFeedback[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [mockupTransition, setMockupTransition] = useState(false)
  const wrongClickId = useRef(0)

  const currentMockup = MOCKUPS[currentMockupIndex]
  const totalPatterns = MOCKUPS.reduce((sum, m) => sum + m.patterns.length, 0)
  const currentMockupFound = currentMockup.patterns.filter(p => foundPatterns.has(p.id)).length
  const allCurrentFound = currentMockupFound === currentMockup.patterns.length

  const handlePatternClick = useCallback((patternId: string) => {
    if (foundPatterns.has(patternId)) return

    const pattern = currentMockup.patterns.find(p => p.id === patternId)
    if (!pattern) return

    playSuccess()
    setFoundPatterns(prev => new Set([...prev, patternId]))
    setScore(prev => prev + 10)
    setShowExplanation(pattern)
  }, [foundPatterns, currentMockup])

  const handleWrongClick = useCallback((e: React.MouseEvent) => {
    // Only trigger if clicking the background, not a pattern
    const target = e.target as HTMLElement
    if (target.closest('[data-pattern]')) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const id = ++wrongClickId.current
    glitch()
    setWrongClicks(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }])
    setTimeout(() => {
      setWrongClicks(prev => prev.filter(w => w.id !== id))
    }, 1000)
  }, [])

  const handleNextMockup = useCallback(() => {
    if (currentMockupIndex < MOCKUPS.length - 1) {
      setMockupTransition(true)
      scan()
      setTimeout(() => {
        setCurrentMockupIndex(prev => prev + 1)
        setShowExplanation(null)
        setMockupTransition(false)
      }, 400)
    } else {
      impact()
      setIsComplete(true)
      onComplete?.(score, foundPatterns.size, totalPatterns)
    }
  }, [currentMockupIndex, score, foundPatterns.size, totalPatterns, onComplete])

  const handleAddEvidence = useCallback(() => {
    onEvidenceAdd?.({
      type: 'dark-pattern-findings',
      data: {
        score,
        patternsFound: foundPatterns.size,
        totalPatterns,
        mockups: MOCKUPS.map(m => ({
          title: m.title,
          patternsFound: m.patterns.filter(p => foundPatterns.has(p.id)).map(p => ({
            label: p.label,
            category: p.category,
            explanation: p.explanation,
          })),
        })),
      },
    })
  }, [score, foundPatterns, totalPatterns, onEvidenceAdd])

  // Summary screen
  if (isComplete) {
    const percentage = Math.round((foundPatterns.size / totalPatterns) * 100)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="max-w-lg w-full"
        >
          {/* Score reveal */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-6xl font-mono font-bold text-green-400 mb-2"
            >
              {score}
            </motion.div>
            <p className="text-green-500/60 font-mono text-xs tracking-widest uppercase">
              Investigation Score
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="border border-green-500/20 rounded p-3 text-center">
              <div className="text-2xl font-mono text-green-400">{foundPatterns.size}</div>
              <div className="text-xs text-green-500/50 font-mono uppercase tracking-wider mt-1">
                Patterns Found
              </div>
            </div>
            <div className="border border-green-500/20 rounded p-3 text-center">
              <div className="text-2xl font-mono text-green-400">{totalPatterns}</div>
              <div className="text-xs text-green-500/50 font-mono uppercase tracking-wider mt-1">
                Total Hidden
              </div>
            </div>
            <div className="border border-green-500/20 rounded p-3 text-center">
              <div className="text-2xl font-mono text-green-400">{percentage}%</div>
              <div className="text-xs text-green-500/50 font-mono uppercase tracking-wider mt-1">
                Detection Rate
              </div>
            </div>
          </div>

          {/* Findings list */}
          <div className="border border-green-500/20 rounded p-4 mb-6 max-h-48 overflow-y-auto">
            <h3 className="text-xs font-mono text-green-500/70 uppercase tracking-wider mb-3">
              Patterns Identified
            </h3>
            {MOCKUPS.map(mockup => {
              const found = mockup.patterns.filter(p => foundPatterns.has(p.id))
              if (found.length === 0) return null
              return (
                <div key={mockup.id} className="mb-3">
                  <p className="text-xs text-green-500/40 font-mono uppercase mb-1">
                    {mockup.title}
                  </p>
                  {found.map(p => (
                    <div key={p.id} className="flex items-center gap-2 mb-1">
                      <span className="text-green-400 text-xs">&#10003;</span>
                      <span className="text-green-300/80 text-xs font-mono">{p.label}</span>
                      <span className="text-green-500/30 text-xs font-mono">({p.category})</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddEvidence}
            className="w-full border border-green-500/40 text-green-400 font-mono text-sm py-3 rounded
              hover:bg-green-500/10 transition-colors tracking-wider uppercase"
          >
            &#9670; Add to Evidence Dossier
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  const MockupComponent = currentMockup.component

  return (
    <div className="h-full flex flex-col">
      {/* ── Score Bar ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-green-500/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-green-500/50 font-mono text-xs uppercase tracking-wider">Score</span>
            <motion.span
              key={score}
              initial={{ scale: 1.3, color: '#4ade80' }}
              animate={{ scale: 1, color: '#22c55e' }}
              className="text-green-500 font-mono text-sm font-bold tabular-nums"
            >
              {score}
            </motion.span>
          </div>
          <div className="h-4 w-px bg-green-500/10" />
          <div className="flex items-center gap-2">
            <span className="text-green-500/50 font-mono text-xs uppercase tracking-wider">
              Mockup
            </span>
            <span className="text-green-400 font-mono text-sm tabular-nums">
              {currentMockupIndex + 1}/{MOCKUPS.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500/50 font-mono text-xs uppercase tracking-wider">
            Found
          </span>
          <span className="text-green-400 font-mono text-sm tabular-nums">
            {currentMockupFound}/{currentMockup.patterns.length}
          </span>
          {allCurrentFound && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-400 text-xs"
            >
              &#10003;
            </motion.span>
          )}
        </div>
      </div>

      {/* ── Browser Frame ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4">
        <AnimatePresence mode="wait">
          {!mockupTransition && (
            <motion.div
              key={currentMockup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Browser chrome */}
              <div className="flex-shrink-0 bg-gray-800 rounded-t-lg px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 ml-2">
                  <div className="bg-gray-700/60 rounded px-3 py-1 text-xs text-gray-400 font-mono flex items-center gap-2">
                    <span className="text-gray-500">&#128274;</span>
                    <span className="truncate">{currentMockup.url}</span>
                  </div>
                </div>
              </div>

              {/* Mockup content */}
              <div className="flex-1 overflow-y-auto rounded-b-lg relative border border-gray-700/50 border-t-0">
                <MockupComponent
                  patterns={currentMockup.patterns}
                  found={foundPatterns}
                  onPatternClick={handlePatternClick}
                  onWrongClick={handleWrongClick}
                />

                {/* Wrong click feedback */}
                <AnimatePresence>
                  {wrongClicks.map(wc => (
                    <motion.div
                      key={wc.id}
                      initial={{ opacity: 1, scale: 0.5 }}
                      animate={{ opacity: 0, scale: 1.5, y: -20 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute pointer-events-none"
                      style={{ left: wc.x - 60, top: wc.y - 12 }}
                    >
                      <span className="text-red-400/80 font-mono text-xs whitespace-nowrap bg-red-900/40 px-2 py-1 rounded">
                        Not a dark pattern
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Explanation Panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex-shrink-0 border-t border-green-500/20 bg-black/95 backdrop-blur-sm"
          >
            <div className="p-4 max-h-44 overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 text-sm">&#10003;</span>
                    <h3 className="text-green-400 font-mono text-xs font-bold uppercase tracking-wider">
                      {showExplanation.label}
                    </h3>
                    <span className="text-green-500/30 font-mono text-xs border border-green-500/20 rounded px-1.5 py-0.5">
                      {showExplanation.category}
                    </span>
                  </div>
                  <p className="text-green-300/70 text-xs leading-relaxed font-mono">
                    {showExplanation.explanation}
                  </p>
                </div>
                <button
                  onClick={() => setShowExplanation(null)}
                  className="text-green-500/40 hover:text-green-400 text-lg flex-shrink-0 font-mono"
                >
                  &#10005;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-green-500/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {MOCKUPS.map((m, i) => {
            const allFound = m.patterns.every(p => foundPatterns.has(p.id))
            const someFound = m.patterns.some(p => foundPatterns.has(p.id))
            return (
              <div
                key={m.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentMockupIndex
                    ? 'bg-green-400'
                    : allFound
                      ? 'bg-green-600'
                      : someFound
                        ? 'bg-green-800'
                        : 'bg-green-500/10'
                }`}
              />
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          {!allCurrentFound && (
            <button
              onClick={handleNextMockup}
              className="text-green-500/30 hover:text-green-500/60 font-mono text-xs uppercase tracking-wider transition-colors min-h-[44px] px-3"
            >
              Skip &#8594;
            </button>
          )}
          {allCurrentFound && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextMockup}
              className="border border-green-500/40 text-green-400 font-mono text-xs px-4 py-2.5 rounded
                hover:bg-green-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
            >
              {currentMockupIndex < MOCKUPS.length - 1 ? 'Next Mockup >' : 'See Results >'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
