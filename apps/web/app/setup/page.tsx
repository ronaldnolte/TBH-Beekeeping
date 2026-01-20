'use client';

import Image from 'next/image';
import { navigateTo } from '../../lib/navigation';

export default function SetupPage() {
    return (
        <div className="min-h-screen honeycomb-bg">
            {/* Header */}
            <div className="bg-[#E67E22] text-white p-6 shadow-md">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Setup Guide</h1>
                        <button
                            onClick={() => navigateTo('/')}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors border-none cursor-pointer font-inherit text-white"
                        >
                            ← Back to App
                        </button>
                    </div>
                    <p className="text-white/90 mt-2">Get started with TBH Beekeeper</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    {/* Welcome */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                            <span>🐝</span>
                            <span>Welcome to TBH Beekeeper!</span>
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            TBH Beekeeper is a comprehensive management tool designed specifically for Top Bar Hive beekeepers.
                            Track your apiaries, manage individual hives, record inspections, monitor bar configurations, and stay
                            organized with weather forecasts and task management—all in one place.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Whether you're managing a single backyard hive or multiple apiaries, TBH Beekeeper helps you keep
                            detailed records and make informed decisions about your bees.
                        </p>
                    </div>

                    {/* Browser Access */}
                    <section className="mb-8 p-6 bg-[#FFF8F0] rounded-lg border-2 border-[#E67E22]">
                        <h3 className="text-xl font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                            <span>🌐</span>
                            <span>Getting Started - Run in Your Browser</span>
                        </h3>
                        <p className="text-gray-700 mb-4">The easiest way to use TBH Beekeeper is directly in your web browser—no installation required!</p>
                        <div className="bg-white p-4 rounded-lg mb-4">
                            <h4 className="font-bold text-[#4A3C28] mb-2">Access the App:</h4>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                <li>Open your web browser (Chrome, Safari, Firefox, or Edge)</li>
                                <li>Navigate to: <a href="https://tbh.beektools.com" className="text-[#E67E22] font-semibold hover:underline">https://tbh.beektools.com</a></li>
                                <li>Sign up for a free account or click <strong>"Continue as Guest"</strong> to try it out</li>
                                <li>Start managing your hives!</li>
                            </ol>
                        </div>
                        <div className="bg-[#E67E22]/10 p-4 rounded-lg">
                            <h4 className="font-bold text-[#4A3C28] mb-2">Try as Guest:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Click the <strong>"Continue as Guest"</strong> button on the login page</li>
                                <li>Explore with pre-loaded demo data</li>
                                <li>See all features in action</li>
                                <li>No signup required for testing</li>
                            </ul>
                        </div>
                    </section>

                    {/* Mobile Installation */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                            <span>📱</span>
                            <span>Install as a Mobile App (PWA)</span>
                        </h3>
                        <p className="text-gray-700 mb-6">
                            For the best mobile experience, install TBH Beekeeper as a Progressive Web App (PWA) on your phone.
                            It works offline and feels just like a native app!
                        </p>

                        {/* Android */}
                        <div className="mb-6 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                            <h4 className="text-lg font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                                <span>📱</span>
                                <span>Installing on Android</span>
                            </h4>

                            <div className="mb-4">
                                <h5 className="font-bold text-[#4A3C28] mb-2">Option 1: Install as PWA (Recommended)</h5>
                                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                                    <li><strong>Open in Chrome:</strong> Navigate to https://tbh.beektools.com</li>
                                    <li><strong>Install:</strong> Tap the three-dot menu (⋮) → "Add to Home screen" or "Install app"</li>
                                    <li><strong>Launch:</strong> Tap the icon on your home screen—works offline!</li>
                                </ol>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                                <h5 className="font-bold text-[#4A3C28] mb-2">Option 2: Native Android App (Beta)</h5>
                                <p className="text-gray-700 mb-2">Want the native Android app from Google Play?</p>
                                <div className="text-gray-700">
                                    <strong>To join the beta:</strong>
                                    <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                                        <li>Email: <a href="mailto:ron.nolte@gmail.com?subject=TBH Beekeeper Beta Request" className="text-[#E67E22] font-semibold hover:underline">ron.nolte@gmail.com</a></li>
                                        <li>Subject: "TBH Beekeeper Beta"</li>
                                        <li>I'll add you to the beta tester list</li>
                                        <li>You'll receive a Google Play link</li>
                                    </ol>
                                </div>
                                <p className="text-sm text-gray-600 italic mt-2">*Beta availability limited - PWA works great for most users!*</p>
                            </div>
                        </div>

                        {/* iOS */}
                        <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <h4 className="text-lg font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                                <span>🍎</span>
                                <span>Installing on iOS (iPhone/iPad)</span>
                            </h4>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Open in Safari:</strong> Must use Safari browser (not Chrome)</li>
                                <li>Navigate to https://tbh.beektools.com</li>
                                <li><strong>Add to Home Screen:</strong> Tap Share button (⬆️) → "Add to Home Screen"</li>
                                <li><strong>Launch:</strong> Tap the icon—enjoy a native app experience!</li>
                            </ol>
                            <p className="text-sm text-gray-600 italic mt-4">
                                <strong>Note:</strong> iOS PWAs work offline and auto-update when you're online.
                            </p>
                        </div>
                    </section>

                    {/* Key Features */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                            <span>🎓</span>
                            <span>Key Features</span>
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-[#4A3C28] mb-2 flex items-center gap-2">
                                    <span>📍</span>
                                    <span>Apiary Management</span>
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    <li>Track multiple apiary locations</li>
                                    <li>14-day weather forecasts</li>
                                    <li>Add/edit/delete as needed</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-[#4A3C28] mb-2 flex items-center gap-2">
                                    <span>🏠</span>
                                    <span>Hive Tracking</span>
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    <li>Unlimited hives per apiary</li>
                                    <li>Visual bar configurations</li>
                                    <li>Active/inactive status</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-[#4A3C28] mb-2 flex items-center gap-2">
                                    <span>📊</span>
                                    <span>Bar Configuration Snapshots</span>
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    <li>Click bars to set status (brood, honey, empty)</li>
                                    <li>Capture snapshots with one click</li>
                                    <li>View configuration history</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-[#4A3C28] mb-2 flex items-center gap-2">
                                    <span>🔍</span>
                                    <span>Inspection Records</span>
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    <li>Log detailed inspections</li>
                                    <li>Track brood pattern, queen sightings</li>
                                    <li>Monitor swarm/queen cells</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-[#4A3C28] mb-2 flex items-center gap-2">
                                    <span>📋</span>
                                    <span>Interventions</span>
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    <li>Log feeding, treatments, modifications</li>
                                    <li>Track dates and details</li>
                                    <li>Maintain complete history</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-[#4A3C28] mb-2 flex items-center gap-2">
                                    <span>✅</span>
                                    <span>Task Management</span>
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    <li>Create hive-specific tasks</li>
                                    <li>Set due dates</li>
                                    <li>Never miss activities</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Bar Configuration Visual */}
                    <section className="mb-8 p-6 bg-[#FFF8F0] rounded-lg border-2 border-[#E67E22]">
                        <h3 className="text-xl font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                            <span>🐝</span>
                            <span>Understanding Bar Configuration</span>
                        </h3>
                        <p className="text-gray-700 mb-4">Click individual bars to set their status, then capture snapshots to track changes over time:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                            <li><strong className="text-[#92400E]">Brood (brown)</strong> - Bars with brood comb</li>
                            <li><strong className="text-[#D97706]">Resource (yellow)</strong> - Bars with honey/pollen</li>
                            <li><strong>Empty (white)</strong> - Empty bars</li>
                            <li><strong className="text-[#06B6D4]">Active (cyan)</strong> - Actively worked bars</li>
                            <li><strong className="text-gray-600">Inactive (dark gray)</strong> - Unused bars</li>
                        </ul>
                        <p className="text-sm text-gray-600">
                            <strong>Why track bar configuration?</strong> See your hive layout at a glance, track expansion/contraction patterns,
                            plan interventions, monitor brood nest movement, and identify when to add/remove bars.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section className="mb-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                        <h3 className="text-xl font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                            <span>🎉</span>
                            <span>Quick Start Checklist</span>
                        </h3>
                        <div className="space-y-2 text-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Access the app: <a href="https://tbh.beektools.com" className="text-[#E67E22] font-semibold hover:underline">https://tbh.beektools.com</a></span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Try as guest OR create an account</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Install as PWA on your phone (optional but recommended)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Take the in-app guided tours</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Add your first apiary</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Add your first hive</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Set up bar configuration</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Capture your first snapshot</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                <input type="checkbox" className="w-4 h-4" />
                                <span>Record your next inspection</span>
                            </label>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <h3 className="text-xl font-bold text-[#4A3C28] mb-4 flex items-center gap-2">
                            <span>📧</span>
                            <span>Need Help or Have Questions?</span>
                        </h3>
                        <p className="text-gray-700 mb-4">
                            <strong>Email:</strong> <a href="mailto:ron.nolte@gmail.com" className="text-[#E67E22] font-semibold hover:underline">ron.nolte@gmail.com</a>
                        </p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Subject line suggestions:</strong></p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>"TBH Beekeeper - Android Beta Request"</li>
                            <li>"TBH Beekeeper - Question"</li>
                            <li>"TBH Beekeeper - Bug Report"</li>
                            <li>"TBH Beekeeper - Feature Request"</li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="text-center py-8">
                    <p className="text-lg font-bold text-[#4A3C28] mb-2">Happy Beekeeping! 🍯🐝</p>
                    <p className="text-gray-600 italic mb-4">TBH Beekeeper - Making Top Bar Hive management simple and organized.</p>
                    <button
                        onClick={() => navigateTo('/')}
                        className="inline-block bg-[#E67E22] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#D35400] transition-colors border-none cursor-pointer font-inherit"
                    >
                        Start Using TBH Beekeeper →
                    </button>
                </div>
            </div>
        </div>
    );
}
