import { redirect, fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  const companyId = url.searchParams.get('company_id')
  if (!companyId) {
    throw redirect(303, '/register/business')
  }
  
  // Verify user has access to this company
  const { data: user } = await locals.supabase
    .from('users')
    .select('company_id, companies(name, registration_status)')
    .eq('id', session.user.id)
    .eq('company_id', companyId)
    .single()
  
  if (!user) {
    throw redirect(303, '/register/business')
  }
  
  // Check existing documents
  const { data: documents } = await locals.supabase
    .from('business_documents')
    .select('document_type, file_name, uploaded_at')
    .eq('company_id', companyId)
  
  return {
    company: user.companies,
    companyId,
    existingDocuments: documents || []
  }
}

export const actions: Actions = {
  uploadDocument: async ({ request, locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      throw redirect(303, '/login')
    }

    try {
      const formData = await request.formData()
      const companyId = formData.get('company_id') as string
      const documentType = formData.get('document_type') as string
      const file = formData.get('file') as File

      if (!file || file.size === 0) {
        return fail(400, { error: 'Please select a file to upload' })
      }

      // Validate file type (PDF only for now)
      if (file.type !== 'application/pdf') {
        return fail(400, { error: 'Only PDF files are allowed' })
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return fail(400, { error: 'File size must be less than 5MB' })
      }

      // Verify user has access to this company
      const { data: user } = await locals.supabase
        .from('users')
        .select('company_id')
        .eq('id', session.user.id)
        .eq('company_id', companyId)
        .single()

      if (!user) {
        return fail(403, { error: 'Access denied' })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `business_documents/${companyId}/${documentType}_${timestamp}_${sanitizedFileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await locals.supabase.storage
        .from('business-documents')
        .upload(storagePath, file)

      if (uploadError) {
        console.error('File upload error:', uploadError)
        return fail(500, { error: 'Failed to upload file' })
      }

      // Save document record to database
      const { error: dbError } = await locals.supabase
        .from('business_documents')
        .upsert({
          company_id: companyId,
          document_type: documentType,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          uploaded_by: session.user.id
        }, {
          onConflict: 'company_id,document_type,file_name'
        })

      if (dbError) {
        console.error('Database error:', dbError)
        // Clean up uploaded file
        await locals.supabase.storage
          .from('business-documents')
          .remove([storagePath])
        return fail(500, { error: 'Failed to save document record' })
      }

      return { 
        success: true, 
        message: `${documentType.replace('_', ' ')} uploaded successfully!` 
      }

    } catch (error) {
      console.error('Document upload error:', error)
      return fail(500, { error: 'Upload failed. Please try again.' })
    }
  },

  submitForReview: async ({ request, locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      throw redirect(303, '/login')
    }

    try {
      const formData = await request.formData()
      const companyId = formData.get('company_id') as string

      // Verify user has access to this company
      const { data: user } = await locals.supabase
        .from('users')
        .select('company_id')
        .eq('id', session.user.id)
        .eq('company_id', companyId)
        .single()

      if (!user) {
        return fail(403, { error: 'Access denied' })
      }

      // Check required documents are uploaded
      const { data: documents } = await locals.supabase
        .from('business_documents')
        .select('document_type')
        .eq('company_id', companyId)

      const requiredDocs = ['business_license', 'insurance_certificate']
      const uploadedDocs = documents?.map(d => d.document_type) || []
      const missingDocs = requiredDocs.filter(doc => !uploadedDocs.includes(doc))

      if (missingDocs.length > 0) {
        return fail(400, { 
          error: `Please upload required documents: ${missingDocs.map(d => d.replace('_', ' ')).join(', ')}` 
        })
      }

      // Update company status to submitted
      const { error: updateError } = await locals.supabase
        .from('companies')
        .update({
          registration_status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .eq('id', companyId)

      if (updateError) {
        console.error('Status update error:', updateError)
        return fail(500, { error: 'Failed to submit for review' })
      }

      // TODO: Send notification to ProcureServe staff
      // TODO: Send confirmation email to business user

      throw redirect(303, '/registration-status')

    } catch (error) {
      if (error instanceof Response) {
        throw error // Re-throw redirects
      }
      console.error('Submit for review error:', error)
      return fail(500, { error: 'Submission failed. Please try again.' })
    }
  }
}
