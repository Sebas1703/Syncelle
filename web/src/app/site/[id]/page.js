import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import SiteView from '@/components/SiteView';

export const dynamic = 'force-dynamic';

export default async function SitePage({ params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('projects')
    .select('structured_data')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error loading project:", error);
    return notFound();
  }

  return <SiteView projectData={data.structured_data} projectId={id} />;
}
