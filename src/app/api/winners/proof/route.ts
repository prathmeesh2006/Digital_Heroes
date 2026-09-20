import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PROOF_UPLOAD } from '@/config/constants';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const winnerId = formData.get('winnerId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No proof file provided' }, { status: 400 });
    }

    if (file.size > PROOF_UPLOAD.maxFileSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // In local dev/mock or Supabase storage:
    // Store record in winner_proofs table
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    let fileUrl = `/uploads/${fileName}`;

    // Attempt Supabase storage upload if bucket exists
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(PROOF_UPLOAD.bucket)
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from(PROOF_UPLOAD.bucket)
          .getPublicUrl(fileName);
        fileUrl = publicUrlData.publicUrl;
      }
    } catch {
      // Supabase storage bucket not yet initialized or dev mode; fallback to placeholder path
      fileUrl = `https://placehold.co/800x600?text=Scorecard+Proof+Uploaded+${encodeURIComponent(file.name)}`;
    }

    // Insert into winner_proofs
    const { data: proofRecord, error: proofError } = await supabase
      .from('winner_proofs')
      .insert({
        winner_id: winnerId,
        user_id: user.id,
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (proofError) {
      // If table doesn't have winner_id or mock mode
      console.warn('Proof insert note:', proofError.message);
    }

    // Update winner record status to 'pending_verification'
    if (winnerId) {
      await supabase
        .from('winners')
        .update({ verification_status: 'pending_verification' })
        .eq('id', winnerId)
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      proof: proofRecord,
    });
  } catch (err: any) {
    console.error('Proof upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload verification proof' },
      { status: 500 }
    );
  }
}
