'use client';

import { HiveDetails } from '../../../components/HiveDetails';
import { use, useEffect, useState } from 'react';

export default function HiveDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return <HiveDetails hiveId={params.id} />;
}
