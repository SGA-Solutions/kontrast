import siteSettings from './siteSettings';
import serviceCategory from './serviceCategory';
import service from './service';
import projectCategory from './projectCategory';
import beforeAfter from './objects/beforeAfter';
import project from './project';
import post from './post';
import person from './person';
import menu from './menu';

export const schemaTypes = [
  // Documents
  siteSettings,
  serviceCategory,
  service,
  projectCategory,
  project,
  post,
  person,
  menu,
  // Objects
  beforeAfter,
];
