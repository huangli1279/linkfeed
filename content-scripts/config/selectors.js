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
    selector: "textarea[id='prompt-textarea']",
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
    url: 'https://deepseek.com',
    selector: 'textarea', // DeepSeek uses standard textarea element
    icon: 'assets/ai-logos/deepseek.svg',
    enabled: true
  },
  kimi: {
    id: 'kimi',
    name: 'Kimi',
    url: 'https://kimi.moonshot.cn',
    selector: 'div[contenteditable="true"]', // Kimi uses contenteditable div
    icon: 'assets/ai-logos/kimi.svg',
    enabled: true
  },
  doubao: {
    id: 'doubao',
    name: '豆包',
    url: 'https://doubao.com',
    selector: 'textarea', // Doubao uses textarea element
    icon: 'assets/ai-logos/doubao.svg',
    enabled: true
  }
};

/**
 * Prompt Template Configuration
 * Template for generating prompts to inject into AI services
 */
export const PROMPT_TEMPLATE = {
  template: 'Read this web page content: {URL}. I need to ask you questions based on it...',
  placeholder: '{URL}'
};

/**
 * Generate a prompt by replacing the URL placeholder in the template
 * @param {string} url - The URL to inject into the prompt template
 * @returns {string} The generated prompt with URL included
 */
export function generatePrompt(url) {
  return PROMPT_TEMPLATE.template.replace(PROMPT_TEMPLATE.placeholder, url);
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
      return urlHostname.includes(serviceHostname) || serviceHostname.includes(urlHostname);
    }) || null;
  } catch (error) {
    return null;
  }
}
