import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold border-b border-slate-200 pb-4 mb-8">Privacy Policy</h1>
      <p className="text-slate-600 mb-6">Last Updated: January 2026</p>

      <p className="mb-4 leading-relaxed">
        Welcome to <strong>LinkFeed</strong> ("we", "our", or "us"). We are committed to protecting your privacy. This
        Privacy Policy explains how our browser extension collects, uses, and discloses information, and your rights
        regarding this information.
      </p>

      <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">1. Data Collection and Usage</h2>
      <p className="mb-4 leading-relaxed">LinkFeed is designed to be privacy-first. Our core philosophy is to minimize data collection.</p>
      <ul className="list-disc pl-6 mb-6 space-y-3">
        <li><strong>No Personal Data Collection:</strong> We do not collect personal information such as your name,
          email address, or phone number on our servers. The extension operates primarily on your local device.</li>
        <li><strong>URL Processing:</strong> When you use LinkFeed to "feed" a link to an AI service, the extension
          reads the URL of your current active tab. This URL is strictly used to generate the prompt for the AI
          service you selected. We do not store your browsing history.</li>
        <li><strong>Usage Statistics:</strong> We do not track your specific browsing habits. We may collect anonymous,
          aggregated usage statistics (e.g., which AI services are most popular) via standard platform analytics (like
          Chrome Web Store analytics) to improve the product.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">2. Data Sharing</h2>
      <p className="mb-4 leading-relaxed">We do not sell, trade, or rent your personal identification information to others.</p>
      <ul className="list-disc pl-6 mb-6 space-y-3">
        <li><strong>AI Service Providers:</strong> When you choose to send a link to an AI provider (e.g., ChatGPT,
          Claude, Gemini, etc.), the URL and the generated prompt are passed directly to that third-party service.
          Your interaction with those services is governed by their respective privacy policies.</li>
        <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in the
          good-faith belief that such action is necessary to comply with state and federal laws or respond to a court
          order, judicial, or other government subpoena or warrant.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">3. Permissions Explanation</h2>
      <p className="mb-4 leading-relaxed">To function correctly, LinkFeed requires certain permissions in your browser. Here is why we need them:</p>
      <ul className="list-disc pl-6 mb-6 space-y-3">
        <li><strong>Tabs (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">tabs</code>):</strong> Required to read the URL of the current active tab so it can be
          passed to the AI service.</li>
        <li><strong>Scripting (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">scripting</code>):</strong> Required to automatically fill the prompt into the
          input field of the target AI service.</li>
        <li><strong>Host Permissions:</strong> Required to access the websites of the AI services (e.g., openai.com,
          anthropic.com) to perform the automated text injection.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">4. Data Security</h2>
      <p className="mb-4 leading-relaxed">
        Since we do not store your personal data on our servers, the risk of a data breach on our end is minimal. The
        security of the data transmitted to AI providers depends on the security measures of those third-party providers
        and your connection security (HTTPS).
      </p>

      <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">5. Changes to This Policy</h2>
      <p className="mb-4 leading-relaxed">
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy
        Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">6. Contact Us</h2>
      <p className="mb-4 leading-relaxed">If you have any questions about this Privacy Policy, please contact us via our GitHub repository:</p>
      <p className="mb-4">
        <a href="https://github.com/huangli1279/linkfeed/issues"
           target="_blank"
           rel="noopener noreferrer"
           className="text-brand-600 hover:underline hover:text-brand-700 font-medium">
          https://github.com/huangli1279/linkfeed/issues
        </a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
