import axios from "axios";

const BING_TRANSLATE_ENDPOINT = "https://api.cognitive.microsofttranslator.com";
const BING_SUBSCRIPTION_KEY = "YOUR_API_KEY";  
const BING_LOCATION = "YOUR_REGION"; 

export const translateText = async (text: string, targetLanguage: string) => {
  try {
    const response = await axios({
      baseURL: BING_TRANSLATE_ENDPOINT,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": BING_SUBSCRIPTION_KEY,
        "Ocp-Apim-Subscription-Region": BING_LOCATION,
        "Content-type": "application/json",
      },
      params: {
        "api-version": "3.0",
        to: targetLanguage,
      },
      data: [
        {
          text: text,
        },
      ],
      responseType: "json",
    });

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};
