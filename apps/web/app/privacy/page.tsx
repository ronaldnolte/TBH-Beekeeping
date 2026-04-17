import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy — BeekTools',
    description: 'Privacy policy for the BeekTools and TBH Beekeeper application.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-amber-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-12">

                {/* Header */}
                <div className="mb-10">
                    <div className="text-5xl mb-4">🐝</div>
                    <h1 className="text-3xl font-bold text-amber-800 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500 text-sm">
                        <strong>BeekTools / TBH Beekeeper</strong> &nbsp;·&nbsp; Last updated: April 16, 2026
                    </p>
                </div>

                <div className="space-y-8 text-gray-700 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Overview</h2>
                        <p>
                            BeekTools (also distributed as <strong>TBH Beekeeper</strong> on Google Play) is a personal beekeeping
                            management application built and maintained by Ronald Nolte. We are committed to protecting your
                            privacy. This policy explains what data we collect, how it is used, and your rights regarding that data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Information We Collect</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                <strong>Account information:</strong> Your email address and password (stored securely via Supabase Auth).
                            </li>
                            <li>
                                <strong>Beekeeping data:</strong> Hive inspection records, varroa mite test results, apiary locations, and
                                notes you enter into the app.
                            </li>
                            <li>
                                <strong>Usage data:</strong> Anonymous analytics collected via Google Analytics to help us understand how
                                the app is used and improve it over time.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>To provide, maintain, and improve the application.</li>
                            <li>To store and retrieve your beekeeping records across devices.</li>
                            <li>To send important account-related communications (e.g., password resets).</li>
                            <li>We do <strong>not</strong> sell your data to third parties.</li>
                            <li>We do <strong>not</strong> use your data for advertising purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Data Storage & Security</h2>
                        <p>
                            Your data is stored securely using <strong>Supabase</strong>, a hosted PostgreSQL database platform with
                            row-level security enabled. Data is encrypted in transit via HTTPS and at rest. We retain your data for as
                            long as your account is active. You may request deletion of your account and associated data at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Third-Party Services</h2>
                        <p className="mb-2">The app uses the following third-party services:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Supabase</strong> — Database and authentication (<a href="https://supabase.com/privacy" className="text-amber-600 underline">Privacy Policy</a>)</li>
                            <li><strong>Google Analytics</strong> — Anonymous usage analytics (<a href="https://policies.google.com/privacy" className="text-amber-600 underline">Privacy Policy</a>)</li>
                            <li><strong>Google Gemini AI</strong> — Powers the "Ask AI" beekeeping assistant feature (<a href="https://policies.google.com/privacy" className="text-amber-600 underline">Privacy Policy</a>)</li>
                            <li><strong>Expo / EAS</strong> — Mobile app build and delivery platform (<a href="https://expo.dev/privacy" className="text-amber-600 underline">Privacy Policy</a>)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Children's Privacy</h2>
                        <p>
                            BeekTools is not directed at children under the age of 13. We do not knowingly collect personal
                            information from children. If you believe we have inadvertently collected such information, please
                            contact us and we will promptly delete it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside text-gray-700 mt-2 mb-4 space-y-2">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Withdraw consent at any time by discontinuing use of the app.</li>
                        </ul>
                        <p className="mt-4">
                            <strong>Account Deletion:</strong> You can request the deletion of your account and all associated data at any time by visiting our 
                            <a href="/delete-account" className="text-amber-600 underline ml-1">Account Deletion Page</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. Any changes will be posted on this page with an
                            updated date. Continued use of the app after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-amber-700 mb-2">Contact</h2>
                        <p>
                            If you have any questions about this privacy policy or your data, please contact us at:{' '}
                            <a href="mailto:ronald@beektools.com" className="text-amber-600 underline">
                                ronald@beektools.com
                            </a>
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}
