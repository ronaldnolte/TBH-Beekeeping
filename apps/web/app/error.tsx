'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
            <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
            <div className="mb-4 p-4 bg-red-50 text-red-800 rounded text-left overflow-auto max-w-lg">
                <p className="font-bold">Error Details:</p>
                <p className="font-mono text-xs mt-1">{error.message}</p>
                {error.digest && <p className="font-mono text-xs text-gray-500 mt-1">Digest: {error.digest}</p>}
            </div>
            <button
                className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    );
}
