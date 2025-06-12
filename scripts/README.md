 * Usage: How to run this script
 * 
 * Example: node scripts/script-name.js
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = 'your-anon-key'

// Main function
async function main() {
  console.log('🚀 Starting script...')
  
  try {
    // Script logic here
    console.log('✅ Script completed successfully')
  } catch (error) {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
```

### Adding to Package.json
```json
{
  "scripts": {
    "script-name": "node scripts/script-name.js"
  }
}
```

### Documentation Requirements
- Add script description to this README
- Include usage examples
- Document expected behavior
- Add troubleshooting section

## Contributing

When adding new scripts:

1. **Follow naming conventions**
2. **Include comprehensive error handling**
3. **Add to package.json scripts**
4. **Update this README**
5. **Test thoroughly**
6. **Document expected behavior**

## Support

For script issues:
1. Check debug output
2. Verify Supabase is running
3. Check environment configuration
4. Review `/docs/testing.md` for detailed troubleshooting

All scripts are designed to be self-documenting with clear output and error messages.
