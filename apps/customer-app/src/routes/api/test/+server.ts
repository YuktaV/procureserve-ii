import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Test Supabase connection
    const { data: testData, error: testError } = await locals.supabase
      .from('companies')
      .select('id, name')
      .limit(1)
    
    if (testError) {
      console.error('Supabase connection error:', testError)
      return json({ error: 'Database connection failed', details: testError }, { status: 500 })
    }
    
    return json({ 
      success: true, 
      message: 'API endpoint working',
      testData,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('API error:', error)
    return json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
