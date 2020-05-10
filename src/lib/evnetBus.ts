import Vue from 'vue';

export const eventBus = new Vue();

export const enum BusEvent {
  ADMIN_LOGIN = 'admin-login',
  SELECT_CATEGORY = 'select-category',
};
