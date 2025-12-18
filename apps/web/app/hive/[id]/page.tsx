'use client';

import { HiveDetails } from '../../../components/HiveDetails';
import { use, useEffect, useState } from 'react';
import { database } from '../../../lib/database';
import { Q } from '@nozbe/watermelondb';

export default function HiveDetailPage({
    params,
}: {
    params: { id: string };
}) {
    // In Next.js 14 App Router, params is an object (unless using advanced async params)
    // We can use it directly.

    return <HiveDetails hiveId={params.id} />;
}
