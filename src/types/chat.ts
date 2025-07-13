export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  type: "text" | "plugin";
  pluginName?: string;
  pluginData?: any;
  timestamp: string;
  isLoading?: boolean;
}

export interface Plugin {
  name: string;
  description: string;
  trigger: RegExp;
  slashCommand: string;
  naturalLanguagePatterns?: RegExp[];
  execute: (input: string, match: RegExpMatchArray) => Promise<PluginResponse>;
}

export interface PluginResponse {
  success: boolean;
  data?: any;
  error?: string;
  renderType: "text" | "card" | "table" | "image";
}

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface CalculatorData {
  expression: string;
  result: number | string;
}

export interface DictionaryData {
  word: string;
  definitions: {
    partOfSpeech: string;
    definition: string;
    example?: string;
  }[];
  pronunciation?: string;
}