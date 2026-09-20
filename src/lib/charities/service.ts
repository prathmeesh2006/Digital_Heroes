import { createClient } from '@/lib/supabase/server';
import type { Charity } from '@/types';
import { FALLBACK_CHARITIES } from '@/config/charities';

export { FALLBACK_CHARITIES };

export async function getCharities(): Promise<Charity[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_CHARITIES;
    }

    return data as Charity[];
  } catch {
    return FALLBACK_CHARITIES;
  }
}

export async function getCharityByIdOrSlug(idOrSlug: string): Promise<Charity | null> {
  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const query = supabase.from('charities').select('*');
    if (isUuid) {
      query.eq('id', idOrSlug);
    } else {
      query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      const fallback = FALLBACK_CHARITIES.find(
        (c) => c.id === idOrSlug || c.slug === idOrSlug
      );
      return fallback || null;
    }

    return data as Charity;
  } catch {
    const fallback = FALLBACK_CHARITIES.find(
      (c) => c.id === idOrSlug || c.slug === idOrSlug
    );
    return fallback || null;
  }
}
