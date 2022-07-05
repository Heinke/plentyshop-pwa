import { apiClientFactory } from '@vue-storefront/core';
import axios from 'axios';
import type { Settings, Endpoints } from './types';
import { getProduct } from './api/getProduct';
import { getCategory } from './api/getCategory';
import { getFacet } from './api/getFacet';

function onCreate(settings: Settings) {
  const client = axios.create({
    baseURL: settings.api.url
  });
  return {
    config: settings,
    client
  };
}

const { createApiClient } = apiClientFactory<Settings, Endpoints>({
  onCreate,
  api: {
    getProduct,
    getCategory,
    getFacet
  }
});

export {
  createApiClient
};
