/**
 * AI Service Configuration
 * Centralized configuration for AI service URLs, DOM selectors, and metadata
 *
 * Contract: /specs/001-chrome-extension/contracts/ai-services.md
 */

export const AI_SERVICES = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    selector: "#prompt-textarea",
    icon: 'assets/ai-logos/chatgpt.svg',
    enabled: true
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai',
    selector: "div[contenteditable='true']",
    icon: 'assets/ai-logos/claude.svg',
    enabled: true
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com',
    selector: "div[contenteditable='true'][role='textbox']",
    icon: 'assets/ai-logos/gemini.svg',
    enabled: true
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    selector: 'textarea', // DeepSeek uses standard textarea element
    icon: 'assets/ai-logos/deepseek.svg',
    enabled: true
  },
  kimi: {
    id: 'kimi',
    name: 'Kimi',
    url: 'https://www.kimi.com',
    selector: 'div.chat-input-editor[contenteditable="true"]', // Kimi uses Lexical editor
    icon: 'assets/ai-logos/kimi.svg',
    domains: ['kimi.moonshot.cn', 'kimi.com', 'kimi.ai'],
    enabled: true
  },
  doubao: {
    id: 'doubao',
    name: '豆包',
    url: 'https://doubao.com',
    selector: "textarea[data-testid='chat_input_input']", // Doubao uses specific testid
    icon: 'assets/ai-logos/doubao.svg',
    enabled: true
  }
};

/**
 * Prompt Template Configuration
 * Template for generating prompts to inject into AI services
 */
export const PROMPT_TEMPLATE = {
  en: 'Read this web page content: {URL}. I need to ask you questions based on it.',
  zh: '请阅读这个网页的内容：{URL}。我需要基于它向你提问。',
  placeholder: '{URL}'
};

/**
 * Generate a prompt by replacing the URL placeholder in the template
 * @param {string} url - The URL to inject into the prompt template
 * @param {string} lang - The language code ('en' or 'zh'), defaults to 'en'
 * @returns {string} The generated prompt with URL included
 */
export function generatePrompt(url, lang = 'en') {
  const template = PROMPT_TEMPLATE[lang] || PROMPT_TEMPLATE.en;
  return template.replace(PROMPT_TEMPLATE.placeholder, url);
}

/**
 * Validate a CSS selector
 * @param {string} selector - CSS selector to validate
 * @returns {boolean} True if selector is valid, false otherwise
 */
export function isValidSelector(selector) {
  try {
    document.querySelector(selector);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get AI service configuration by ID
 * @param {string} serviceId - The service ID (e.g., 'chatgpt', 'claude')
 * @returns {object|null} Service configuration object or null if not found
 */
export function getServiceById(serviceId) {
  return AI_SERVICES[serviceId] || null;
}

/**
 * Get AI service configuration by URL
 * @param {string} url - The URL to match against service URLs
 * @returns {object|null} Service configuration object or null if not found
 */
export function getServiceByUrl(url) {
  try {
    const urlHostname = new URL(url).hostname;
    return Object.values(AI_SERVICES).find(service => {
      const serviceHostname = new URL(service.url).hostname;
      const matchesUrl = urlHostname.includes(serviceHostname) || serviceHostname.includes(urlHostname);

      if (matchesUrl) return true;

      // Check additional domains if configured
      if (service.domains && Array.isArray(service.domains)) {
        return service.domains.some(domain => urlHostname.includes(domain));
      }

      return false;
    }) || null;
  } catch (error) {
    return null;
  }
}
