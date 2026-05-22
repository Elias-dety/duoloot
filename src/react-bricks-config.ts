import { createElement } from 'react';
import { types } from 'react-bricks/frontend';

import Hero from '@/bricks/Hero';

export const reactBricksConfig = {
  appId: 'fba2a711-9553-4f99-bdb0-1a713d257c00',
  apiKey: 'a074acb7-86c1-467a-ae5a-58b27027ae85',
  bricks: [Hero],
  pageTypes: [
    {
      name: 'page',
      pluralName: 'pages',
      defaultLocked: false,
      defaultStatus: types.PageStatus.Published,
      getDefaultContent: () => [],
    },
  ],
  renderLocalLink: ({
    href,
    target,
    className,
    tabIndex,
    children,
    ...rest
  }) =>
    createElement(
      'a',
      {
        ...rest,
        href,
        target,
        className,
        tabIndex,
      },
      children
    ),
  navigate: (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  },
  appRootElement: '#root',
} satisfies types.ReactBricksConfig;
