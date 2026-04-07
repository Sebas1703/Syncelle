import "./globals.css";

export const metadata = {
  title: "Syncelle — GDPR-Ready Documents for Your SaaS in Minutes",
  description: "Generate Privacy Policy, Terms of Service, DPA, and Sub-processor List tailored to your SaaS. Enterprise-grade compliance without the enterprise price tag.",
  keywords: "GDPR compliance, DPA generator, privacy policy generator, SaaS compliance, sub-processor list, terms of service generator",
  openGraph: {
    title: "Syncelle — GDPR-Ready Documents for Your SaaS",
    description: "Generate Privacy Policy, Terms of Service, DPA, and Sub-processor List tailored to your SaaS in 10 minutes.",
    type: "website",
    url: "https://syncelle.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
