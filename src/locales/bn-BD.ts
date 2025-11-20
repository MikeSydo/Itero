import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pages from './en-US/pages';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';

export default {
  'navBar.lang': 'ভাষা',
  'layout.user.link.help': 'সহায়তা',
  'layout.user.link.privacy': 'গোপনীয়তা',
  'layout.user.link.terms': 'শর্তাদি',
  'app.preview.down.block': 'আপনার স্থানীয় প্রকল্পে এই পৃষ্ঠাটি ডাউনলোড করুন',
  'app.welcome.link.fetch-blocks': 'সমস্ত ব্লক পান',
  'app.welcome.link.block-list':
    '`block` ডেভেলপমেন্ট এর উপর ভিত্তি করে দ্রুত স্ট্যান্ডার্ড, পৃষ্ঠাসমূহ তৈরি করুন।',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
