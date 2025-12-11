import { GoogleGenAI, Type } from "@google/genai";
import { PodcastEpisode, Speaker } from "../types";
import { base64ToUint8Array, decodeAudioData } from "../utils/audioUtils";

// Safely retrieve API Key preventing "process is not defined" error in browsers
const getApiKey = () => {
  try {
    if (typeof process !== "undefined" && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    console.warn("process.env is not accessible");
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generatePodcastScript = async (topic: string, level: string): Promise<Omit<PodcastEpisode, 'audioBuffer'>> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Create an extensive educational podcast script for German learners about the topic: "${topic}".
    The difficulty level should be: ${level}.
    
    The podcast should feature two speakers: 
    1. Host (Teacher/Guide - Female persona)
    2. Guest (Student/Curious Learner - Male persona)
    
    The dialogue should be primarily in German, suitable for the specified level. 
    
    **Structure & Content:**
    1. Cover 3-4 distinct situations or sub-scenarios related to the main topic to provide a comprehensive lesson.
    2. The dialogue should be very substantial, natural, and approximately 30-45 exchanges long.
    3. Ensure smooth transitions between the situations.
    
    **Vocabulary:**
    Include 12-15 key vocabulary words/phrases with:
    - German definitions
    - Vietnamese definitions
    - Example sentences
  `;

  // Define schema for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy title for the podcast episode in German" },
      summary: { type: Type.STRING, description: "A summary in German covering the multiple situations" },
      dialogue: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            speaker: { type: Type.STRING, enum: ["Host", "Guest"] },
            text: { type: Type.STRING, description: "The spoken line in German" }
          },
          required: ["speaker", "text"]
        }
      },
      vocabulary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            definition: { type: Type.STRING, description: "German definition" },
            vietnameseDefinition: { type: Type.STRING, description: "Vietnamese definition" },
            example: { type: Type.STRING }
          },
          required: ["word", "definition", "vietnameseDefinition", "example"]
        }
      }
    },
    required: ["title", "summary", "dialogue", "vocabulary"]
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate script");
  }

  const data = JSON.parse(response.text);

  return {
    id: generateId(),
    topic,
    level: level as any,
    createdAt: Date.now(),
    ...data
  };
};

export const generatePodcastAudio = async (dialogue: { speaker: string; text: string }[]): Promise<AudioBuffer> => {
  const model = "gemini-2.5-flash-preview-tts";

  // Construct the multi-speaker prompt
  // We explicitly map our "Host" and "Guest" to specific voice configurations.
  // Host (Female) -> Kore
  // Guest (Male) -> Fenrir
  
  // Create a dialogue script format that the model understands well for TTS context
  // However, for multiSpeakerVoiceConfig, we just send the text and map speakers in config.
  // We need to format the text to indicate turns or just rely on the config if we could send structured input, 
  // but standard TTS text prompt usually expects a string. 
  // The Gemini TTS with multi-speaker uses the config to map speakers. 
  // But strictly speaking, the API expects a single string prompt. 
  // To use multi-speaker effectively, we format the text like a script:
  // "Speaker1: Hello.\nSpeaker2: Hi there."
  
  const textPrompt = dialogue.map(line => `${line.speaker}: ${line.text}`).join('\n');

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{ text: textPrompt }] },
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: 'Host',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } // Female-sounding
            },
            {
              speaker: 'Guest',
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } // Male-sounding
            }
          ]
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error("No audio data returned from API");
  }

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(
    base64ToUint8Array(base64Audio),
    audioContext,
    24000,
    1
  );

  return audioBuffer;
};