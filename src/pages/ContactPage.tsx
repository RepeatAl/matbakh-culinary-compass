
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.contact')}</h1>
      <p className="mt-4">Content for the Contact page will go here. Email: admin [at] whatsgonow [dot] com</p>
    </div>
  );
};

export default ContactPage;
