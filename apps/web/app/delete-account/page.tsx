import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Account Deletion — BeekTools',
    description: 'Request deletion of your BeekTools account and data.',
};

export default function DeleteAccountPage() {
    return (
        <main className="min-h-screen bg-amber-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-12 text-center">
                <div className="text-5xl mb-6">🗑️</div>
                <h1 className="text-3xl font-bold text-amber-800 mb-4">Account & Data Deletion</h1>
                
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                    If you would like to delete your BeekTools (TBH Beekeeper) account and all associated data, 
                    we are here to help.
                </p>

                <div className="bg-amber-50 rounded-xl p-6 mb-8 text-left">
                    <h2 className="font-bold text-amber-900 mb-2">What happens when you delete:</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Your account credentials will be permanently removed.</li>
                        <li>All apiary and hive inspection records will be deleted.</li>
                        <li>All AI interaction history will be cleared.</li>
                        <li>This action cannot be undone.</li>
                    </ul>
                </div>

                <p className="text-gray-600 mb-8">
                    To proceed, please send an email from the address associated with your account to:
                </p>

                <a 
                    href="mailto:ron.nolte@gmail.com?subject=Account Deletion Request" 
                    className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all active:scale-95 text-xl"
                >
                    Email Deletion Request
                </a>

                <p className="mt-8 text-sm text-gray-400">
                    Requests are typically processed within 48 hours.
                </p>
            </div>
        </main>
    );
}
