import PageLayout from '../../components/layout/PageLayout';

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <PageLayout>
      <section className="bg-green-50 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <article className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">{title}</h1>
            <div className="space-y-4 leading-7 text-gray-600">{children}</div>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
