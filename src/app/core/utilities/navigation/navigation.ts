/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: 'influencers',
    title: 'Influencers',
    type: 'basic',
    icon: 'heroicons_outline:user',
    link: '/influencers'
  },
  {
    id: 'influencers-new',
    title: 'New Influencers List',
    type: 'basic',
    icon: 'heroicons_outline:user',
    link: '/influencers/new'
  },
  {
    id: 'user-profile',
    title: 'User profile',
    type: 'basic',
    icon: 'heroicons_outline:user-circle',
    link: '/user/profile'
  },
  {
    id: 'companies-list',
    title: 'Companies',
    type: 'basic',
    icon: 'heroicons_outline:building-storefront',
    link: '/companies'
  },
  {
    id: 'collaborations-list',
    title: 'Collaborations List',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations'
  },
  {
    id: 'collaborations-create',
    title: 'Create Collaboration',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations/create'
  },
  {
    id: 'collaborations-details',
    title: 'Collaboration Details',
    type: 'basic',
    icon: 'heroicons_outline:paper-airplane',
    link: '/collaborations/:id'
  }
];

//====================================================

export const unauthorizedUserNavigation: FuseNavigationItem[] = [
  {
    id: 'collaborations-list',
    title: 'Collaborations List',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations/list'
  }
];

export const influenserNavigation: FuseNavigationItem[] = [
  {
    id: 'collaborations-list',
    title: 'Collaborations List',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations/list'
  },
  {
    id: 'collaborations-companies',
    title: 'Active Collaborations',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations/companies'
  }
];

export const adminNavigation: FuseNavigationItem[] = [
  {
    id: 'companies-list',
    title: 'Companies',
    type: 'basic',
    icon: 'heroicons_outline:building-storefront',
    link: '/companies'
  },
  {
    id: 'collaborations-influencers',
    title: 'Active Collaborations',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations/influencers'
  },
  {
    id: 'collaborations-companies-admin',
    title: 'Active Collaborations (Influencer view)',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations/companies'
  },
  {
    id: 'collaborations-list',
    title: 'Collaborations List',
    type: 'basic',
    icon: 'heroicons_outline:arrows-right-left',
    link: '/collaborations/list'
  },
  {
    id: 'influencers-new',
    title: 'New Influencers List',
    type: 'basic',
    icon: 'heroicons_outline:user',
    link: '/influencers/new'
  },
  {
    id: 'support-tickets',
    title: 'Support Tickets',
    type: 'basic',
    icon: 'mat_outline:help_outline',
    link: '/support/admin/tickets'
  }
];
