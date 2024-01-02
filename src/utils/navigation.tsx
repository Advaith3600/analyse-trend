import { IRoute } from '@/types/navigation';
// NextJS Requirement
export const isWindowAvailable = () => typeof window !== 'undefined';

export const findCurrentRoute = (
  routes: IRoute[],
  pathname: string,
): IRoute | undefined => {
  for (let route of routes) {
    if (pathname?.match(route.path) && route) {
      return route;
    }
  }
};

export const getActiveRoute = (routes: IRoute[], pathname: string): string => {
  const route = findCurrentRoute(routes, pathname);
  return route?.name || 'AnalyseTrend';
};
