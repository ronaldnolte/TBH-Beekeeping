'use client';

import { useState } from 'react';
import { navigateTo } from '../../lib/navigation';

export default function HelpPage() {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [tutorialStep, setTutorialStep] = useState(0);

    const tutorialSteps = [
        {
            title: "Welcome to BeekTools! 🐝",
            description: "This app helps you manage your hives with ease. Let's get you started!",
            icon: "🎉",
        },
        {
            title: "Create Your First Apiary",
            description: "An apiary is a location where you keep your hives. Start by adding your first apiary with a name and zip code for weather forecasts.",
            icon: "📍",
            steps: [
                "Click the '+' button on the Apiary Selection page",
                "Enter your apiary name (e.g., 'Backyard Bees')",
                "Add your zip code for local weather",
                "Save your apiary"
            ]
        },
        {
            title: "Add Your Hives",
            description: "Once you have an apiary, you can add hives to it. BeekTools supports Langstroth, Top Bar, and Layens hives.",
            icon: "🏠",
            steps: [
                "Select your apiary from the list",
                "Click 'Add Hive' button",
                "Give your hive a name",
                "Set the number of bars",
                "Save your hive"
            ]
        },
        {
            title: "Record Inspections",
            description: "Regular inspections help you monitor hive health. Log what you observe during each visit.",
            icon: "🔍",
            steps: [
                "Open a hive from your apiary",
                "Click 'New Inspection'",
                "Record observations (brood, honey, queen, etc.)",
                "Add notes about hive condition",
                "Save the inspection"
            ]
        },
        {
            title: "Plan Interventions",
            description: "Track treatments and hive modifications to keep your bees healthy.",
            icon: "💉",
            steps: [
                "Select a hive",
                "Go to 'Interventions'",
                "Record treatments or modifications",
                "Note date and type of intervention"
            ]
        },
        {
            title: "Manage Tasks",
            description: "Never forget important beekeeping activities. Create tasks and get reminders.",
            icon: "✅",
            steps: [
                "Click 'Add Task' from any hive",
                "Set task description and due date",
                "Assign to yourself",
                "Complete tasks when done"
            ]
        },
        {
            title: "Check Weather Forecasts",
            description: "Plan your inspections around the weather. View 14-day forecasts for each apiary.",
            icon: "🌤️",
            steps: [
                "Open any apiary",
                "View the weather forecast widget",
                "Check temperature and conditions",
                "Plan inspections for favorable weather"
            ]
        },
        {
            title: "You're All Set! 🎊",
            description: "You now know the basics of BeekTools. Start managing your hives like a pro!",
            icon: "🚀",
        }
    ];

    const faqItems = [
        {
            question: "What types of hives are supported?",
            answer: "BeekTools supports Langstroth (10-frame & 8-frame), Long Langstroth, Top Bar Hives, Layens, and Warré hives."
        },
        {
            question: "How often should I inspect my hives?",
            answer: "Generally, inspect hives every 7-10 days during active season (spring/summer) and less frequently in fall/winter. Weather conditions and hive health may require more or less frequent checks."
        },
        {
            question: "What should I look for during inspections?",
            answer: "Check for: presence of queen, brood pattern, honey stores, pollen, signs of disease or pests, temperament, and overall hive population."
        },
        {
            question: "How do I use the Guest account?",
            answer: "Click 'Continue as Guest' on the login page to try the app without creating an account. Guest data is shared and meant for testing purposes."
        },
        {
            question: "Can I use this on my phone or tablet?",
            answer: "Yes! The app works great on mobile devices and is available as a mobile app on Google Play for Android devices."
        },
        {
            question: "How do I export my data?",
            answer: "Your data is stored in the cloud and always accessible. We're working on export features for future releases."
        }
    ];

    return (
        <div className="min-h-screen honeycomb-bg">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">📚</div>
                            <div>
                                <h1 className="text-3xl font-bold">Help & Tutorial</h1>
                                <p className="text-white/80 text-sm">Everything you need to know about BeekTools</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigateTo('/apiary-selection')}
                            className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors backdrop-blur-sm border-none cursor-pointer text-inherit font-inherit"
                        >
                            ← Back to App
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sticky top-4">
                            <h3 className="font-bold text-[#4A3C28] mb-3 text-sm uppercase">Sections</h3>
                            <nav className="space-y-1">
                                {[
                                    { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
                                    { id: 'tutorial', label: 'Interactive Tutorial', icon: '🎓' },
                                    { id: 'features', label: 'Features Guide', icon: '⭐' },
                                    { id: 'faq', label: 'FAQ', icon: '❓' },
                                    { id: 'tips', label: 'Best Practices', icon: '💡' },
                                ].map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${activeSection === section.id
                                            ? 'bg-[#E67E22] text-white font-semibold'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <span>{section.icon}</span>
                                        <span>{section.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Getting Started */}
                        {activeSection === 'getting-started' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#4A3C28] mb-2">Getting Started</h2>
                                    <p className="text-gray-600">Welcome to BeekTools! Here's how to begin your beekeeping journey.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-l-4 border-[#E67E22] bg-orange-50 p-4 rounded">
                                        <div className="text-2xl mb-2">🆕</div>
                                        <h3 className="font-bold text-[#4A3C28] mb-1">New Users</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Start with our interactive tutorial to learn the basics.
                                        </p>
                                        <button
                                            onClick={() => setActiveSection('tutorial')}
                                            className="bg-[#E67E22] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D35400] transition-colors"
                                        >
                                            Start Tutorial →
                                        </button>
                                    </div>

                                    <div className="border-l-4 border-[#8B4513] bg-amber-50 p-4 rounded">
                                        <div className="text-2xl mb-2">👤</div>
                                        <h3 className="font-bold text-[#4A3C28] mb-1">Guest Access</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Try the app without signing up using our guest account.
                                        </p>
                                        <button
                                            onClick={() => navigateTo('/')}
                                            className="inline-block bg-[#8B4513] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#723910] transition-colors border-none cursor-pointer font-inherit"
                                        >
                                            Login Page →
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-[#4A3C28] mb-3">Quick Start Guide</h3>
                                    <div className="space-y-3">
                                        {[
                                            { step: 1, title: "Create an Apiary", desc: "Add a location where your hives are kept" },
                                            { step: 2, title: "Add Hives", desc: "Register each of your Top Bar Hives" },
                                            { step: 3, title: "Record Inspections", desc: "Log your observations during hive checks" },
                                            { step: 4, title: "Track Health", desc: "Monitor trends and spot issues early" },
                                        ].map((item) => (
                                            <div key={item.step} className="flex gap-4 items-start">
                                                <div className="flex-shrink-0 w-8 h-8 bg-[#E67E22] text-white rounded-full flex items-center justify-center font-bold">
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#4A3C28]">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Interactive Tutorial */}
                        {activeSection === 'tutorial' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold text-[#4A3C28] mb-6">Interactive Tutorial</h2>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Step {tutorialStep + 1} of {tutorialSteps.length}</span>
                                        <span>{Math.round(((tutorialStep + 1) / tutorialSteps.length) * 100)}% Complete</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-[#E67E22] to-[#D35400] h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${((tutorialStep + 1) / tutorialSteps.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Tutorial Step */}
                                <div className="text-center mb-8">
                                    <div className="text-7xl mb-4">{tutorialSteps[tutorialStep].icon}</div>
                                    <h3 className="text-2xl font-bold text-[#4A3C28] mb-3">
                                        {tutorialSteps[tutorialStep].title}
                                    </h3>
                                    <p className="text-gray-600 text-lg mb-6">
                                        {tutorialSteps[tutorialStep].description}
                                    </p>

                                    {tutorialSteps[tutorialStep].steps && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
                                            <h4 className="font-semibold text-[#4A3C28] mb-3 flex items-center gap-2">
                                                <span>📝</span> Step-by-Step:
                                            </h4>
                                            <ol className="space-y-2">
                                                {tutorialSteps[tutorialStep].steps.map((step, idx) => (
                                                    <li key={idx} className="flex gap-3 text-gray-700">
                                                        <span className="font-bold text-[#E67E22]">{idx + 1}.</span>
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                                        disabled={tutorialStep === 0}
                                        className="px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    >
                                        ← Previous
                                    </button>

                                    <div className="flex gap-2">
                                        {tutorialSteps.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setTutorialStep(idx)}
                                                className={`w-3 h-3 rounded-full transition-all ${idx === tutorialStep
                                                    ? 'bg-[#E67E22] w-8'
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {tutorialStep < tutorialSteps.length - 1 ? (
                                        <button
                                            onClick={() => setTutorialStep(tutorialStep + 1)}
                                            className="px-6 py-3 rounded-lg font-semibold bg-[#E67E22] text-white hover:bg-[#D35400] transition-colors"
                                        >
                                            Next →
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigateTo('/apiary-selection')}
                                            className="px-6 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors border-none cursor-pointer font-inherit"
                                        >
                                            Start Using App! 🚀
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Features Guide */}
                        {activeSection === 'features' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 space-y-6">
                                <h2 className="text-3xl font-bold text-[#4A3C28] mb-4">Features Guide</h2>

                                {[
                                    {
                                        title: "Apiary Management",
                                        icon: "🏡",
                                        features: [
                                            "Create multiple apiaries for different locations",
                                            "Track zip code for weather forecasts",
                                            "View all hives in each apiary at a glance",
                                            "Edit apiary details anytime"
                                        ]
                                    },
                                    {
                                        title: "Hive Tracking",
                                        icon: "🐝",
                                        features: [
                                            "Name and organize your hives",
                                            "Track number of top bars",
                                            "View hive history and health trends",
                                            "Quick snapshot of hive status"
                                        ]
                                    },
                                    {
                                        title: "Inspections",
                                        icon: "🔍",
                                        features: [
                                            "Log detailed inspection notes",
                                            "Record brood patterns, honey stores, and queen status",
                                            "Track hive health over time",
                                            "View inspection history with dates"
                                        ]
                                    },
                                    {
                                        title: "Weather Integration",
                                        icon: "⛅",
                                        features: [
                                            "14-day weather forecast for each apiary",
                                            "Plan inspections based on conditions",
                                            "Temperature and precipitation data",
                                            "Automatic updates based on zip code"
                                        ]
                                    },
                                    {
                                        title: "Task Management",
                                        icon: "✓",
                                        features: [
                                            "Create tasks for specific hives",
                                            "Set due dates and descriptions",
                                            "Mark tasks as complete",
                                            "View upcoming tasks dashboard"
                                        ]
                                    },
                                    {
                                        title: "Interventions",
                                        icon: "💊",
                                        features: [
                                            "Track treatments and medications",
                                            "Record hive modifications",
                                            "Log feeding schedules",
                                            "Maintain intervention history"
                                        ]
                                    }
                                ].map((feature, idx) => (
                                    <div key={idx} className="border-l-4 border-[#E67E22] bg-orange-50 p-6 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl">{feature.icon}</span>
                                            <h3 className="text-xl font-bold text-[#4A3C28]">{feature.title}</h3>
                                        </div>
                                        <ul className="space-y-2 ml-12">
                                            {feature.features.map((item, i) => (
                                                <li key={i} className="flex gap-2 items-start text-gray-700">
                                                    <span className="text-[#E67E22] mt-1">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FAQ */}
                        {activeSection === 'faq' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold text-[#4A3C28] mb-6">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    {faqItems.map((item, idx) => (
                                        <details key={idx} className="group border-b border-gray-200 pb-4">
                                            <summary className="cursor-pointer font-semibold text-[#4A3C28] hover:text-[#E67E22] transition-colors flex justify-between items-center">
                                                <span>{item.question}</span>
                                                <span className="text-[#E67E22] group-open:rotate-180 transition-transform">▼</span>
                                            </summary>
                                            <p className="mt-3 text-gray-600 pl-4">{item.answer}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Best Practices */}
                        {activeSection === 'tips' && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 space-y-6">
                                <h2 className="text-3xl font-bold text-[#4A3C28] mb-4">Best Practices & Tips</h2>

                                {[
                                    {
                                        title: "Regular Inspections",
                                        tip: "Inspect your hives every 7-10 days during active season. Consistency helps you spot problems early.",
                                        icon: "📅"
                                    },
                                    {
                                        title: "Detailed Notes",
                                        tip: "Write detailed inspection notes. What seems obvious now might be forgotten in a few weeks. Include observations about queen behavior, brood pattern, and colony temperament.",
                                        icon: "📝"
                                    },
                                    {
                                        title: "Weather Monitoring",
                                        tip: "Check the weather forecast before planning inspections. Avoid inspecting in rain, extreme heat, or when temperatures are below 60°F.",
                                        icon: "🌡️"
                                    },
                                    {
                                        title: "Task Scheduling",
                                        tip: "Use tasks to remind yourself of upcoming activities like feeding, treatment deadlines, or seasonal preparations.",
                                        icon: "⏰"
                                    },
                                    {
                                        title: "Track Interventions",
                                        tip: "Always log treatments and interventions with exact dates. This helps you follow treatment schedules and maintain proper records.",
                                        icon: "💉"
                                    },
                                    {
                                        title: "Backup Your Data",
                                        tip: "Your data is automatically saved to the cloud, but consider taking screenshots of important observations for additional backup.",
                                        icon: "💾"
                                    },
                                    {
                                        title: "Use the Guest Account for Learning",
                                        tip: "New to the app? Use the guest account to practice and learn without affecting your real hive data.",
                                        icon: "🎓"
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5">
                                        <div className="text-4xl flex-shrink-0">{item.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-[#4A3C28] mb-2">{item.title}</h3>
                                            <p className="text-gray-700">{item.tip}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mt-8">
                                    <div className="flex gap-3">
                                        <span className="text-3xl">🌟</span>
                                        <div>
                                            <h3 className="font-bold text-green-900 mb-2">Pro Tip: Start Simple</h3>
                                            <p className="text-green-800">
                                                Don't feel overwhelmed by all the features. Start by simply logging inspections and adding tasks.
                                                As you get comfortable, explore advanced features like detailed intervention tracking and historical trends.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-600 text-sm">
                    <p>Need more help? Have suggestions? Contact support or check our documentation.</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <button
                            onClick={() => navigateTo('/apiary-selection')}
                            className="text-[#E67E22] hover:underline bg-transparent border-none cursor-pointer p-0 font-inherit"
                        >
                            Return to App
                        </button>
                        <span>•</span>
                        <button onClick={() => setActiveSection('tutorial')} className="text-[#E67E22] hover:underline">
                            Restart Tutorial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
