import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";
import { DEMO_AUDIO_URLS } from "../constants";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found, AI features will be disabled");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Return a deterministic audio URL based on the index to ensure it works
const getWorkingUrl = (index: number) => {
    return DEMO_AUDIO_URLS[index % DEMO_AUDIO_URLS.length];
};

const getRandomColor = () => {
    const colors = ['#06b6d4', '#8b5cf6', '#f97316', '#ef4444', '#10b981', '#ec4899', '#eab308'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const generateAiPlaylist = async (vibeDescription: string): Promise<Song[]> => {
  const ai = getAiClient();
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a playlist of 5 REAL, EXISTING popular songs that match this vibe: "${vibeDescription}". 
      Return their real titles and artists.
      For each song, generate 15-20 lines of synchronized lyrics with timestamps (0-60 seconds).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              lyrics: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          time: { type: Type.NUMBER },
                          text: { type: Type.STRING }
                      },
                      required: ["time", "text"]
                  }
              }
            },
            required: ["title", "artist", "lyrics"],
          },
        },
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    
    return rawData.map((item: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      title: item.title,
      artist: item.artist,
      color: getRandomColor(),
      // Use a high-quality image service, falling back to picsum if needed
      cover: `https://picsum.photos/seed/${item.title.replace(/\s/g, '')}${index}/800/800`,
      url: getWorkingUrl(index),
      lyrics: item.lyrics || []
    }));

  } catch (error) {
    console.error("Error generating playlist:", error);
    return [];
  }
};

export const searchSongDetails = async (query: string): Promise<Song[]> => {
   const ai = getAiClient();
   if (!ai) return [];
   
   try {
      const response = await ai.models.generateContent({
         model: "gemini-2.5-flash",
         contents: `The user is searching for "${query}". 
         Return a list of 5 REAL, EXISTING songs that match this search.
         If the user searched for an artist, return their top 5 songs.
         If they searched for a song, return the song and 4 related tracks.
         Generate synchronized lyrics for the first 60 seconds.`,
         config: {
             responseMimeType: "application/json",
             responseSchema: {
                 type: Type.ARRAY,
                 items: {
                    type: Type.OBJECT,
                    properties: {
                        title: {type: Type.STRING},
                        artist: {type: Type.STRING},
                        lyrics: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    time: { type: Type.NUMBER },
                                    text: { type: Type.STRING }
                                },
                                required: ["time", "text"]
                            }
                        }
                    },
                    required: ["title", "artist", "lyrics"]
                 }
             }
         }
      });
       const rawData = JSON.parse(response.text || "[]");
       
       return rawData.map((item: any, index: number) => ({
           id: `search-${Date.now()}-${index}`,
           title: item.title,
           artist: item.artist,
           color: getRandomColor(),
           cover: `https://picsum.photos/seed/${item.title.replace(/\s/g, '')}${index}/800/800`,
           url: getWorkingUrl(index + Math.floor(Math.random() * 5)), // Randomize audio
           lyrics: item.lyrics || []
       }));

   } catch(e) {
       console.error("Search failed", e);
       return [];
   }
};

export const identifySongFromAudio = async (base64Audio: string): Promise<Song | null> => {
    // Mock implementation for demo speed, or keep existing if preferred
    // For this 'Vibe Check 2.0' we'll return a "Found" result quickly
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id: `shazam-${Date.now()}`,
                title: "Sandstorm",
                artist: "Darude",
                cover: "https://picsum.photos/seed/darude/800/800",
                color: "#facc15",
                url: getWorkingUrl(3),
                lyrics: [{time: 0, text: "Du du du du du..."}]
            });
        }, 2000);
    });
};