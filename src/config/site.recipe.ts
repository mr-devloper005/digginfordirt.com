import type { SiteRecipe } from '@/design/factory/recipe-types'

export const SITE_RECIPE: SiteRecipe = {
  productFamily: 'curation',
  themePack: 'curation-library',
  homepageTemplate: 'image-profile-home',
  navbarTemplate: 'editorial-bar',
  footerTemplate: 'editorial-footer',
  motionPack: 'editorial-soft',
  primaryTask: 'sbm',
  enabledTasks: ['sbm'],
  taskTemplates: { sbm: 'sbm-library' },
  manualOverrides: {
    navbar: false,
    footer: false,
    homePage: false,
    taskListPage: false,
    taskDetailPage: false,
    taskCard: false,
    contactPage: false,
    loginPage: false,
    registerPage: false,
  },
}
