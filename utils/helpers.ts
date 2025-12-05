
export const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";

  let message = "An unexpected error occurred";

  // If it's already a string
  if (typeof error === 'string') {
    message = error;
  } 
  // Standard JS Error
  else if (error instanceof Error) {
    message = error.message;
  } 
  // Object handling
  else if (typeof error === 'object') {
    // Recursive checks for nested properties
    if (error.message) {
         if (typeof error.message === 'object') return getErrorMessage(error.message);
         message = String(error.message);
    }
    else if (error.error_description) message = String(error.error_description);
    else if (error.msg) message = String(error.msg);
    else if (error.error) {
         if (typeof error.error === 'object') return getErrorMessage(error.error);
         message = String(error.error);
    }
    else if (error.data && error.data.message) {
         message = String(error.data.message);
    }
    else {
        // Fallback: try to stringify
        try {
            const json = JSON.stringify(error);
            if (json !== '{}' && !json.includes('[object Object]')) {
                message = `Error details: ${json}`;
            }
        } catch {}
    }
  }

  // Final filter for the specific string pattern
  if (message.includes('[object Object]')) {
      return "An error occurred (details unavailable).";
  }

  return message;
};