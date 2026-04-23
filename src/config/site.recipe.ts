import type { SiteRecipe } from '@/design/factory/recipe-types'

export const SITE_RECIPE: SiteRecipe = {
  productFamily: 'curation',
  themePack: 'curation-library',
  homepageTemplate: 'article-home',
  navbarTemplate: 'compact-bar',
  footerTemplate: 'dense-footer',
  motionPack: 'minimal',
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
