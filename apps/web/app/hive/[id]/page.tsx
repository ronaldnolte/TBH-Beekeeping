'use client';

import { HiveDetails } from '../../../components/HiveDetails';


export default function HiveDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return <HiveDetails hiveId={params.id} />;
}
