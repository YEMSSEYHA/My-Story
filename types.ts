
export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  theme: 'it' | 'law' | 'neutral';
  image: string;
}

export interface AnalysisResponse {
  moral: string;
  characterAnalysis: {
    seha: string;
    kanhchana: string;
  };
  itVsLaw: string;
}
