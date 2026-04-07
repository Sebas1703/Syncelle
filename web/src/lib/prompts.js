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
- Cover: data controller info, data collected, purposes, legal bases for each purpose, specific retention periods for each data category, third-party sharing with named services, international transfers with safeguards, user rights (access, rectification, erasure, portability, restriction, objection, withdraw consent, lodge complaint with supervisory authority), cookie policy detailing each cookie type, children's data if applicable, automated decision-making disclosure, contact information for DPO or privacy contact
- Use proper legal headings and numbered sections
- Be specific to the company's actual data practices — reference their actual services and data by name
- Use today's date as the effective date

CRITICAL FORMATTING RULES:
- Output raw Markdown only — do NOT wrap in code fences or backticks
- Start directly with the # heading
- No \`\`\`markdown wrapper`,
      user: `Generate a Privacy Policy for this SaaS company:\n\n${companyInfo}`
    },

    terms_of_service: {
      system: `You are a legal document specialist. Generate professional Terms of Service for a SaaS company. The document must:
- Be written in clear, professional English
- Cover: acceptance of terms, description of service, user accounts and responsibilities, acceptable use policy, intellectual property (company owns service, user owns their data), payment terms with specific payment processor, refund/cancellation policy, service availability and SLA, limitation of liability, disclaimer of warranties, indemnification, termination by both parties, governing law using the company's country, dispute resolution, modifications to terms with notification mechanism, severability, entire agreement, force majeure
- Include SaaS-specific clauses: data ownership, service uptime, API usage if applicable, fair use limits
- Use proper legal headings and numbered sections
- Be specific to the company's actual product — reference their product name and description
- Use the company's country for governing law and jurisdiction
- Use today's date as the effective date

CRITICAL FORMATTING RULES:
- Output raw Markdown only — do NOT wrap in code fences or backticks
- Start directly with the # heading`,
      user: `Generate Terms of Service for this SaaS company:\n\n${companyInfo}`
    },

    dpa: {
      system: `You are a legal document specialist focused on data protection. Generate a comprehensive Data Processing Agreement (DPA) compliant with GDPR Article 28. The document must:
- Be written in clear, professional English
- Include: definitions, scope and purpose of processing, obligations of the processor (8+ specific obligations with GDPR article references), obligations of the controller, sub-processors with prior authorization mechanism, international data transfers with Standard Contractual Clauses (EU 2021/914), data subject rights assistance, data breach notification (72-hour requirement per Article 33), audit rights, data deletion/return on termination, liability and indemnification, term and termination
- Use the company's country ("${data.company_country || 'N/A'}") as the governing law — do NOT use placeholders like [Insert Governing Law]
- Use the company name "${data.company_name || 'N/A'}" as the Processor throughout — do NOT use generic placeholders
- Reference specific GDPR articles throughout
- Include detailed annexes:
  - Annex 1: Description of Processing (nature, purpose, duration, data categories, data subjects)
  - Annex 2: Technical and Organizational Measures — MUST include at least 12 specific measures organized by category:
    * Access Control (MFA, role-based access, password policies)
    * Encryption (TLS 1.2+ in transit, AES-256 at rest)
    * Network Security (firewalls, DDoS protection, VPN)
    * Monitoring (audit logs, intrusion detection, vulnerability scanning)
    * Data Management (backups, data minimization, retention policies)
    * Organizational (employee training, incident response plan, vendor assessments)
    * Reference the actual hosting/infrastructure from the company's stack
  - Annex 3: List of Sub-processors matching ONLY the services from the company's tech stack

CRITICAL FORMATTING RULES:
- Output raw Markdown only — do NOT wrap in code fences or backticks
- Start directly with the # heading
- Do NOT leave any placeholder brackets like [Insert X] — fill everything with the company's actual data`,
      user: `Generate a Data Processing Agreement for this SaaS company acting as data processor:\n\n${companyInfo}`
    },

    sub_processors: {
      system: `You are a compliance specialist. Generate a Sub-processor List document for a SaaS company.

IMPORTANT: ONLY include sub-processors that the company ACTUALLY uses based on their tech stack data below. Do NOT add services they didn't select. If a category shows "N/A" or "None", do not invent sub-processors for it.

For each sub-processor include:
- Company name
- Purpose of processing (specific to what the company uses it for)
- Data categories processed
- Location/country (headquarters)
- Website URL

Also include:
- A header section explaining what sub-processors are
- How changes to the list are communicated (email notification 30 days before changes)
- Mechanism for objection to new sub-processors
- Use today's date as the last updated date

Known sub-processor details for accuracy:
- AWS (Seattle, US): cloud infrastructure
- Google Cloud (Mountain View, US): cloud infrastructure
- Azure (Redmond, US): cloud infrastructure
- Vercel (San Francisco, US): hosting and edge functions
- Netlify (San Francisco, US): hosting
- Supabase (Singapore, HQ): database and authentication
- Firebase (Mountain View, US): database and authentication
- Stripe (San Francisco, US): payment processing
- Paddle (London, UK): payment processing
- SendGrid (Denver, US): email delivery
- Resend (San Francisco, US): email delivery
- Postmark (Philadelphia, US): email delivery
- Sentry (San Francisco, US): error monitoring
- Google Analytics (Mountain View, US): web analytics
- Mixpanel (San Francisco, US): product analytics
- PostHog (London, UK/US): product analytics
- Amplitude (San Francisco, US): product analytics
- Intercom (San Francisco, US): customer messaging
- Cloudflare (San Francisco, US): CDN and security
- Auth0 (Bellevue, US): identity management
- Clerk (San Francisco, US): authentication

CRITICAL FORMATTING RULES:
- Output raw Markdown only — do NOT wrap in code fences or backticks
- Start directly with the # heading`,
      user: `Generate a Sub-processor List for this SaaS company. ONLY include services they actually selected:\n\n${companyInfo}`
    },
  };

  return prompts[docType] || null;
}
