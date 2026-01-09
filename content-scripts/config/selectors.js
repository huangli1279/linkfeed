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
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com',
    selector: "div[contenteditable='true'][role='textbox']",
    icon: 'assets/ai-logos/gemini.svg',
    enabled: true
  },
  doubao: {
    id: 'doubao',
    name: '豆包',
    url: 'https://doubao.com',
    selector: "textarea[data-testid='chat_input_input']", // Doubao uses specific testid
    icon: 'assets/ai-logos/doubao.svg',
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
  yuanbao: {
    id: 'yuanbao',
    name: 'Yuanbao',
    url: 'https://yuanbao.tencent.com/chat',
    selector: "div[contenteditable='true']", // Assumption: Rich text editor
    icon: 'assets/ai-logos/yuanbao.svg',
    enabled: true
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    url: 'https://grok.com',
    selector: "div.ProseMirror[contenteditable='true']", // Updated: Grok uses ProseMirror
    icon: 'assets/ai-logos/grok.svg',
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
  kimi: {
    id: 'kimi',
    name: 'Kimi',
    url: 'https://www.kimi.com',
    selector: 'div.chat-input-editor[contenteditable="true"]', // Kimi uses Lexical editor
    icon: 'assets/ai-logos/kimi.svg',
    domains: ['kimi.moonshot.cn', 'kimi.com', 'kimi.ai'],
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
  claude: {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai',
    selector: "div[contenteditable='true']",
    icon: 'assets/ai-logos/claude.svg',
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
  claude: {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai',
    selector: "div[contenteditable='true']",
    icon: 'assets/ai-logos/claude.svg',
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
  claude: {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai',
    selector: "div[contenteditable='true']",
    icon: 'assets/ai-logos/claude.svg',
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
  qianwen: {
    id: 'qianwen',
    name: 'Qianwen',
    url: 'https://www.qianwen.com',
    selector: 'textarea', // Assumption: Standard textarea or similar
    icon: 'assets/ai-logos/qianwen.svg',
    enabled: true
  }
};

/**
 * Prompt Template Configuration
 * Template for generating prompts to inject into AI services
 */
export const PROMPT_TEMPLATE = {
  en: `Read this web page: {URL}.

I would like you to act as a patient **Senior Lecturer**. Your goal is not just to answer my questions, but to ensure that I **fully understand** the content of the webpage through your explanations.

**When answering my questions, please follow these rules:**
1. **From Simple to Complex**: Explain basic concepts in plain language first, then dive into the professional details of the webpage.
2. **Step-by-Step Breakdown**: Do not dump a lot of information on me at once; instead, break it down into clear steps or points (1, 2, 3...).
3. **Apply and Extend**: If there are difficult keywords in the webpage, please try to illustrate them with examples based on the webpage content.
4. **Completeness Check**: Before finishing your answer, self-check if you have missed any important background information from the webpage.

Please confirm that you have read the content, and I will start asking questions.`,
  zh: `请阅读这个网页：{URL}。

我希望你扮演一位耐心的**资深讲师**。你的目标不仅仅是回答我的问题，更是要确保我通过你的解释**完全听懂**网页里的内容。

**回答我的问题时，请遵循：**
1. **由浅入深**：先用通俗易懂的语言解释基本概念，再深入讲解网页中的专业细节。
2. **分步拆解**：不要把一堆信息直接扔给我，而是拆解为清晰的步骤或要点（1, 2, 3...）。
3. **举一反三**：如果网页中有难懂的关键词，请结合网页内容尝试举例说明。
4. **完整性检查**：在回答结束前，自我检查是否遗漏了网页中相关的任何重要背景信息。

请确认已读取内容，我将开始提问。`,
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
