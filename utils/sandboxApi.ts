// Simulation of Indian Fintech Sandbox APIs (Zoop, Digio, etc.)

export interface SandboxResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const sandboxApi = {
  /**
   * Simulates PAN Verification API
   * POST /api/v1/verify-pan
   */
  verifyPan: async (pan: string): Promise<SandboxResponse<{ fullName: string; status: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic Regex for PAN: 5 letters, 4 digits, 1 letter
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        
        if (panRegex.test(pan.toUpperCase())) {
          resolve({
            success: true,
            data: { 
              fullName: 'ARJUN VERMA', 
              status: 'VALID' 
            }
          });
        } else {
          resolve({ 
            success: false, 
            message: 'Invalid PAN format or not found in database.' 
          });
        }
      }, 1500);
    });
  },

  /**
   * Simulates Aadhaar OTP Generation
   * POST /api/v1/aadhaar/generate-otp
   */
  sendAadhaarOtp: async (aadhaar: string): Promise<SandboxResponse<{ refId: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic validation for 12 digit number
        if (aadhaar.length === 12 && /^\d+$/.test(aadhaar)) {
          resolve({
            success: true,
            message: 'OTP sent successfully to linked mobile (XX98)',
            data: { refId: 'REF_' + Math.floor(Math.random() * 1000000) }
          });
        } else {
          resolve({ 
            success: false, 
            message: 'Invalid Aadhaar Number. Please enter 12 digits.' 
          });
        }
      }, 1500);
    });
  },

  /**
   * Simulates Aadhaar OTP Verification
   * POST /api/v1/aadhaar/verify-otp
   */
  verifyAadhaarOtp: async (refId: string, otp: string): Promise<SandboxResponse<{ name: string; address: string; dob: string; gender: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock OTP validation (Accept '123456')
        if (otp === '123456') {
          resolve({
            success: true,
            data: {
              name: 'Arjun Verma',
              gender: 'M',
              dob: '15-08-1995',
              address: 'Flat 402, Krishna Heights, Sector 12, Mumbai, Maharashtra - 400050'
            }
          });
        } else {
          resolve({ 
            success: false, 
            message: 'Incorrect OTP. Please try again.' 
          });
        }
      }, 1500);
    });
  },

  /**
   * Simulates Bank Account "Penny Drop" Verification
   * POST /api/v1/bank/verify
   */
  verifyBank: async (account: string, ifsc: string): Promise<SandboxResponse<{ beneficiaryName: string; refId: string; bankName: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (account.length > 8 && ifsc.length === 11) {
          resolve({
            success: true,
            message: 'Account verified successfully',
            data: {
              beneficiaryName: 'ARJUN VERMA',
              bankName: 'HDFC BANK',
              refId: 'IMPS_' + Date.now()
            }
          });
        } else {
          resolve({ 
            success: false, 
            message: 'Verification failed. Please check Account No and IFSC.' 
          });
        }
      }, 2000);
    });
  }
};