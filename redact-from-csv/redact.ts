import fetch from 'node-fetch';

export default async function getRedactedString(text: string) {
    try {
      // Step 1: Call Simple Text Analysis API
      const analysisResponse = await fetch('http://localhost:5002/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: 'en'
        })
      });
  
      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze text');
      }
  
      const analysisResult = await analysisResponse.json();
  
      // Step 2: Call Simple Text Anonymization API with the result from the first API call
      const anonymizationResponse = await fetch('http://localhost:5001/anonymize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          analyzer_results: analysisResult, // assuming the analysis result format is compatible
          anonymizers: {
            DEFAULT: {
              type: 'replace',
              new_value: 'NAME'
            },
            // PHONE_NUMBER: {
            //   type: 'mask',
            //   masking_char: '*',
            //   chars_to_mask: 4,
            //   from_end: true
            // }
          }
        })
      });
  
      if (!anonymizationResponse.ok) {
        throw new Error('Failed to anonymize text');
      }
  
      const redactedText = await anonymizationResponse.json();
  
      // Return the redacted string
      return redactedText.text;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  // Usage example
//   getRedactedString('John Smith drivers license is AC432223')
//     .then((redacted) => {
//       console.log('Redacted text:', redacted);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
