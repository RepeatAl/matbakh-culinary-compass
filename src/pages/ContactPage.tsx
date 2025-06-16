
import { useSafeT } from '@/hooks/useSafeT';

const ContactPage = () => {
  const { t } = useSafeT();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.contact', 'Contact')}</h1>
      <p className="mt-4">{t('contact.description', 'Get in touch with us.')}</p>
    </div>
  );
};

export default ContactPage;
