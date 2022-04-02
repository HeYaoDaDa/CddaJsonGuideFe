import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue') },
      {
        name: 'jsonItemSearch',
        path: 'jsonItems/search',
        component: () => import('pages/SearchResultPage.vue'),
      },
      {
        name: 'feature',
        path: 'features/:feature/:sub?',
        component: () => import('pages/CardListPage.vue'),
      },
      {
        name: 'jsonItem',
        path: 'jsonItems/:jsonType/:jsonId',
        component: () => import('pages/JsonItemPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
