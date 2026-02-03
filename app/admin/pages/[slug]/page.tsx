import PageEditor from '@/components/admin/PageEditor';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPagePage({ params }: PageProps) {
  const { slug } = await params;
  
  return (
    <div className="p-6">
      <PageEditor slug={slug} />
    </div>
  );
}
