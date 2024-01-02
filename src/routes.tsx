import { Icon } from './lib/chakra';
import {
  MdHome,
  MdAutoAwesome,
} from 'react-icons/md';

// Auth Imports
import { IRoute } from './types/navigation';

const routes: IRoute[] = [
  {
    name: 'AnalyseTrend',
    path: '/',
    icon: <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'Profile Settings',
    path: '/profile-settings',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
];

export default routes;
