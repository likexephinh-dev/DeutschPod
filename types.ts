export enum Speaker {
  Host = 'Host',
  Guest = 'Guest',
}

export interface VocabularyItem {
  word: string;
  definition: string;
  vietnameseDefinition: string;
  example: string;
}

export interface DialogueLine {
  speaker: Speaker;
  text: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  dialogue: DialogueLine[];
  vocabulary: VocabularyItem[];
  createdAt: number;
  audioBuffer?: AudioBuffer | null; // Cache the generated audio
}

export interface GenerationState {
  isGeneratingScript: boolean;
  isGeneratingAudio: boolean;
  error: string | null;
}