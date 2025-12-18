import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TBH Beekeeper',
        short_name: 'Beekeeper',
        description: 'Top-bar hive management application',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFBF0',
        theme_color: '#F5A623',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
