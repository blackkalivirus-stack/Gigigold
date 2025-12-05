// Simulation of DigiLocker Sandbox API integration
// Based on typical Indian Fintech Sandbox endpoints

export interface DigiLockerDoc {
  doctype: 'PAN' | 'AADHAAR';
  name: string;
  id_number: string;
  dob?: string;
  gender?: string;
  photo_url?: string;
}

export const digilockerService = {
  /**
   * Simulates the OAuth2 authorization flow.
   * In a real app, this would redirect the user to:
   * https://sandbox.digilocker.gov.in/public/oauth2/1/authorize?response_type=code&client_id=...
   */
  connect: async (): Promise<{ success: boolean; token?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a mock access token
        resolve({ success: true, token: 'mock_access_token_xyz123' });
      }, 1500);
    });
  },

  /**
   * Simulates fetching issued documents (PAN, Aadhaar) using the access token.
   * Endpoint: /public/oauth2/1/xml/issued (Simulated)
   */
  fetchDocuments: async (token: string): Promise<{ success: boolean; data?: DigiLockerDoc[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!token) {
           resolve({ success: false });
           return;
        }

        // Mock Data Response mimicking Sandbox XML/JSON conversion
        const mockDocs: DigiLockerDoc[] = [
          {
            doctype: 'PAN',
            name: 'ARJUN VERMA',
            id_number: 'ABCDE1234F',
            dob: '15-08-1995'
          },
          {
            doctype: 'AADHAAR',
            name: 'Arjun Verma',
            id_number: '9876 5432 1098',
            dob: '15-08-1995',
            gender: 'M',
            photo_url: 'https://picsum.photos/200'
          }
        ];

        resolve({ success: true, data: mockDocs });
      }, 2000); // Simulate network delay
    });
  }
};