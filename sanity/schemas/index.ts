import siteSettings from './siteSettings';
import serviceCategory from './serviceCategory';
import service from './service';
import projectCategory from './projectCategory';
import beforeAfter from './objects/beforeAfter';
import image360 from './objects/image360';
import project from './project';
import post from './post';
import person from './person';
import menu from './menu';
import aboutUs from './aboutUs';

export const schemaTypes = [
  // Documents
  siteSettings,
  serviceCategory,
  service,
  projectCategory,
  project,
  aboutUs,
  post,
  person,
  menu,
  // Objects
  beforeAfter,
  image360,
];
