/**
 * Represents a Frequently Asked Question
 */
export interface Faq {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  displayOrder: number;
  active: boolean;
}

/**
 * Represents a FAQ Category containing multiple FAQs
 */
export interface FaqCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  active: boolean;
  faqs: Faq[];
}
