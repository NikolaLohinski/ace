const translations = {
  'english': {},
  'french': {}
};

export default (vue) => {
  vue.i18n.add('english', translations.english);
  vue.i18n.add('french', translations.french);
  vue.i18n.set('english');
};
