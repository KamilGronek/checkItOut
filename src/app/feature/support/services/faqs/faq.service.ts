import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { Faq, FaqCategory } from 'app/feature/support/services/faqs/faq.types';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private _baseUrl: string = `${environment.apiUrl}/support/faq`;

  constructor(private _httpClient: HttpClient) {}

  /**
   * Get all active FAQ categories with their FAQs
   */
  getAllFaqCategories(): Observable<FaqCategory[]> {
    return this._httpClient.get<FaqCategory[]>(`${this._baseUrl}/categories/active`).pipe(
      catchError(error => {
        console.error('Error fetching FAQ categories:', error);
        // Return fallback data in case of error
        return of(this._getFallbackFaqCategories());
      })
    );
  }

  /**
   * Search FAQs by query term
   */
  searchFaqs(query: string): Observable<Faq[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    return this._httpClient
      .get<Faq[]>(`${this._baseUrl}/search?query=${encodeURIComponent(query)}`)
      .pipe(
        catchError(error => {
          console.error('Error searching FAQs:', error);
          return of([]);
        })
      );
  }

  /**
   * Get FAQs by category ID
   */
  getFaqsByCategory(categoryId: string): Observable<Faq[]> {
    return this._httpClient.get<Faq[]>(`${this._baseUrl}/by-category/${categoryId}`).pipe(
      catchError(error => {
        console.error(`Error fetching FAQs for category ${categoryId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Fallback data in case the API is not available
   */
  private _getFallbackFaqCategories(): FaqCategory[] {
    return [
      {
        id: '1',
        name: 'Account & Profile',
        description: 'Manage your account and profile settings',
        displayOrder: 1,
        active: true,
        faqs: [
          {
            id: '101',
            question: 'How do I change my email address?',
            answer:
              'You can change your email address in the Account Settings page. Go to your profile, click on "Settings" and then "Account". From there, you can update your email address. You will need to verify the new email address before the change takes effect.',
            categoryId: '1',
            displayOrder: 1,
            active: true
          },
          {
            id: '102',
            question: 'Can I delete my account?',
            answer:
              'Yes, you can delete your account from the Account Settings page. Please note that this action is permanent and cannot be undone. All your data will be permanently removed from our systems within 30 days.',
            categoryId: '1',
            displayOrder: 2,
            active: true
          }
        ]
      },
      {
        id: '2',
        name: 'Payments & Billing',
        description: 'Questions about payments, subscriptions, and billing',
        displayOrder: 2,
        active: true,
        faqs: [
          {
            id: '201',
            question: 'What payment methods do you accept?',
            answer:
              'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for business accounts. Cryptocurrency payments are currently not supported.',
            categoryId: '2',
            displayOrder: 1,
            active: true
          },
          {
            id: '202',
            question: 'How do I update my payment method?',
            answer:
              'You can update your payment method in the Billing section of your account settings. Go to your profile, click on "Settings" and then "Billing". From there, you can add, remove, or update your payment methods.',
            categoryId: '2',
            displayOrder: 2,
            active: true
          }
        ]
      },
      {
        id: '3',
        name: 'Using the Platform',
        description: 'Help with using platform features and functionality',
        displayOrder: 3,
        active: true,
        faqs: [
          {
            id: '301',
            question: 'How do I connect my Instagram account?',
            answer:
              'To connect your Instagram account, go to your profile settings and select "Connected Accounts". Click on the Instagram icon and follow the authentication process. You will need to authorize our application to access your Instagram data.',
            categoryId: '3',
            displayOrder: 1,
            active: true
          },
          {
            id: '302',
            question: 'How do I create a collaboration?',
            answer:
              'To create a new collaboration, navigate to the Collaborations tab and click on "Create New". Fill out the required information including title, description, budget, and requirements. You can then publish it to make it visible to potential partners.',
            categoryId: '3',
            displayOrder: 2,
            active: true
          }
        ]
      },
      {
        id: '4',
        name: 'Technical Issues',
        description: 'Solutions for common technical problems',
        displayOrder: 4,
        active: true,
        faqs: [
          {
            id: '401',
            question: "Why can't I upload images?",
            answer:
              "If you're having trouble uploading images, please check that the file is in a supported format (JPG, PNG, GIF) and under the 5MB size limit. Also ensure you have a stable internet connection. If the problem persists, try using a different browser or clearing your cache.",
            categoryId: '4',
            displayOrder: 1,
            active: true
          },
          {
            id: '402',
            question: 'The application is loading slowly. What can I do?',
            answer:
              "Slow loading can be caused by various factors. Try clearing your browser cache, using a different browser, or checking your internet connection. If you're using a mobile device, switching to WiFi rather than cellular data may help. If the issue persists, please contact our support team.",
            categoryId: '4',
            displayOrder: 2,
            active: true
          }
        ]
      }
    ];
  }
}
