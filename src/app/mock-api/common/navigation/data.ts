/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'influencers',
        title: 'Influencers',
        type : 'basic',
        icon : 'heroicons_outline:user',
        link : '/influencers'
    },
    {
        id   : 'posts',
        title: 'Posts',
        type : 'basic',
        icon : 'heroicons_outline:paper-airplane',
        link : '/posts'
    },
    {
        id   : 'companies',
        title: 'Companies',
        type : 'basic',
        icon : 'heroicons_outline:building-storefront',
        link : '/companies'
    },
    {
        id   : 'collaborations',
        title: 'Collaborations',
        type : 'basic',
        icon : 'heroicons_outline:arrows-right-left',
        link : '/collaborations'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'A',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'B',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'C',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
