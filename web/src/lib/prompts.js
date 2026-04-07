// System prompts for each document type
// These instruct the AI to generate legally-structured compliance documents

export function buildPrompt(docType, data) {
  const companyInfo = `
Company Name: ${data.company_name || 'N/A'}
Website: ${data.company_website || 'N/A'}
Country: ${data.company_country || 'N/A'}
Address: ${data.company_address || 'N/A'}
Contact Email: ${data.contact_email || 'N/A'}
Product Description: ${data.product_description || 'N/A'}
Business Model: ${data.business_model || 'N/A'}
Data Collected: ${(data.data_collected || []).join(', ') || 'N/A'}
Data Purpose: ${(data.data_purpose || []).join(', ') || 'N/A'}
Data Storage Region: ${data.data_storage_region || 'N/A'}
User Regions: ${(data.user_regions || []).join(', ') || 'N/A'}
Minors: ${data.minors || 'N/A'}
Data Sharing: ${data.data_sharing || 'N/A'}
Cookie Usage: ${(data.cookie_usage || []).join(', ') || 'N/A'}
Hosting: ${(data.hosting || []).join(', ') || 'N/A'}
Database: ${(data.database || []).join(', ') || 'N/A'}
Auth Provider: ${(data.auth_provider || []).join(', ') || 'N/A'}
Payments: ${(data.payments || []).join(', ') || 'N/A'}
Analytics: ${(data.analytics || []).join(', ') || 'N/A'}
Email Service: ${(data.email_service || []).join(', ') || 'N/A'}
Other Services: ${data.other_services || 'N/A'}
`.trim();

  const prompts = {
    privacy_policy: {
      system: `You are a legal document specialist. Generate a comprehensive, GDPR and CCPA compliant Privacy Policy for a SaaS company. The document must:
- Be written in clear, professional English
- Include all required GDPR disclosures (Articles 13/14)
- Cover: data controller info, data collected, purposes, legal bases, retention periods, third-party sharing, international transfers, user rights (access, rectification, erasure, portability, objection), cookie policy, children's data if applicable, contact information
- Use proper legal headings and numbered sections
- Be specific to the company's actual data practices (not generic)
- Include effective date placeholder [EFFECTIVE_DATE]
Output the document in Markdown format with proper headings (##, ###).`,
      user: `Generate a Privacy Policy for this SaaS company:\n\n${companyInfo}`
    },

    terms_of_service: {
      system: `You are a legal document specialist. Generate professional Terms of Service for a SaaS company. The document must:
- Be written in clear, professional English
- Cover: acceptance of terms, description of service, user accounts, acceptable use policy, intellectual property, payment terms (if applicable), limitation of liability, indemnification, termination, governing law, dispute resolution, modifications to terms, severability, entire agreement
- Include SaaS-specific clauses: service availability, data ownership, API usage terms if applicable
- Use proper legal headings and numbered sections
- Be specific to the company's actual product (not generic)
- Include effective date placeholder [EFFECTIVE_DATE]
Output the document in Markdown format with proper headings (##, ###).`,
      user: `Generate Terms of Service for this SaaS company:\n\n${companyInfo}`
    },

    dpa: {
      system: `You are a legal document specialist focused on data protection. Generate a comprehensive Data Processing Agreement (DPA) compliant with GDPR Article 28. The document must:
- Be written in clear, professional English
- Include: definitions, scope and purpose of processing, obligations of the processor, obligations of the controller, sub-processors, international data transfers (including Standard Contractual Clauses reference), data subject rights, data breach notification (72-hour requirement), audit rights, data deletion/return, liability
- Reference specific GDPR articles where applicable
- Include annexes: Annex 1 (Description of Processing), Annex 2 (Technical and Organizational Measures), Annex 3 (List of Sub-processors)
- Be structured as a formal agreement between Controller and Processor
- Include signature block placeholders
Output the document in Markdown format with proper headings (##, ###).`,
      user: `Generate a Data Processing Agreement for this SaaS company acting as data processor:\n\n${companyInfo}`
    },

    sub_processors: {
      system: `You are a compliance specialist. Generate a Sub-processor List document for a SaaS company. For each sub-processor:
- Include: company name, purpose of processing, data categories processed, location/country, website URL
- Organize in a clear table format
- Include a header section explaining what sub-processors are and how changes are communicated
- Include the date of last update placeholder [LAST_UPDATED]
- Only include sub-processors that match the company's actual tech stack
- For each service, accurately describe what personal data it processes

Common sub-processor details you should know:
- AWS (US): cloud infrastructure, all data categories
- Google Cloud (US): cloud infrastructure, all data categories
- Vercel (US): hosting, IP addresses, request logs
- Supabase (US): database, authentication data
- Stripe (US): payment processing, billing data
- SendGrid (US): email delivery, email addresses
- Sentry (US): error tracking, device/browser data
- Mixpanel (US): analytics, usage data
- PostHog (US/EU): analytics, usage data
- Intercom (US): customer support, user data
- Cloudflare (US): CDN/security, IP addresses, request data

Output the document in Markdown format with a table.`,
      user: `Generate a Sub-processor List for this SaaS company:\n\n${companyInfo}`
    },
  };

  return prompts[docType] || null;
}
