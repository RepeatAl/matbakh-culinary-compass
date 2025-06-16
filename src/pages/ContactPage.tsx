
import { useSafeT } from '@/hooks/useSafeT';
import ContactForm from '@/components/contact/ContactForm';

const ContactPage = () => {
  const { t } = useSafeT();

  const description = t('contact.description', 'Get in touch with us.');
  const paragraphs = description.split('\n').filter(p => p.trim());

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {t('navigation.contact', 'Contact')}
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
