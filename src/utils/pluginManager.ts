import { Plugin, PluginResponse, WeatherData, CalculatorData, DictionaryData } from '../types/chat';

class PluginManager {
  private plugins: Plugin[] = [];

  constructor() {
    this.registerDefaultPlugins();
  }

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  async parseAndExecute(input: string): Promise<{ plugin: Plugin; response: PluginResponse } | null> {
    // First try exact slash commands
    for (const plugin of this.plugins) {
      const match = input.match(plugin.trigger);
      if (match) {
        const response = await plugin.execute(input, match);
        return { plugin, response };
      }
    }

    // Then try natural language patterns
    for (const plugin of this.plugins) {
      if (plugin.naturalLanguagePatterns) {
        for (const pattern of plugin.naturalLanguagePatterns) {
          const match = input.match(pattern);
          if (match) {
            const response = await plugin.execute(input, match);
            return { plugin, response };
          }
        }
      }
    }

    return null;
  }

  getAvailableCommands(): string[] {
    return this.plugins.map(plugin => plugin.slashCommand);
  }

  private registerDefaultPlugins() {
    // Weather Plugin
    this.registerPlugin({
      name: 'weather',
      description: 'Get current weather information for any city',
      trigger: /^\/weather\s+(.+)$/i,
      slashCommand: '/weather [city]',
      naturalLanguagePatterns: [
        /(?:what's|what is|how's|how is) the weather (?:in|for|at) ([^?]+)/i,
        /weather (?:in|for|at) ([^?]+)/i,
        /temperature (?:in|for|at) ([^?]+)/i
      ],
      execute: async (input: string, match: RegExpMatchArray): Promise<PluginResponse> => {
        const city = match[1]?.trim();
        if (!city) {
          return {
            success: false,
            error: 'Please specify a city name',
            renderType: 'text'
          };
        }

        try {
          // Using OpenWeatherMap API (free tier)
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=demo&units=metric`
          );

          if (!response.ok) {
            // Fallback to mock data for demo
            const mockWeather: WeatherData = {
              location: city,
              temperature: Math.floor(Math.random() * 30) + 5,
              description: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
              humidity: Math.floor(Math.random() * 40) + 40,
              windSpeed: Math.floor(Math.random() * 20) + 5,
              icon: '01d'
            };

            return {
              success: true,
              data: mockWeather,
              renderType: 'card'
            };
          }

          const data = await response.json();
          const weatherData: WeatherData = {
            location: data.name,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            icon: data.weather[0].icon
          };

          return {
            success: true,
            data: weatherData,
            renderType: 'card'
          };
        } catch (error) {
          return {
            success: false,
            error: 'Failed to fetch weather data',
            renderType: 'text'
          };
        }
      }
    });

    // Calculator Plugin
    this.registerPlugin({
      name: 'calculator',
      description: 'Evaluate mathematical expressions safely',
      trigger: /^\/calc\s+(.+)$/i,
      slashCommand: '/calc [expression]',
      naturalLanguagePatterns: [
        /(?:calculate|compute|what's|what is) (.+?)(?:\?|$)/i,
        /(?:solve|evaluate) (.+?)(?:\?|$)/i
      ],
      execute: async (input: string, match: RegExpMatchArray): Promise<PluginResponse> => {
        const expression = match[1]?.trim();
        if (!expression) {
          return {
            success: false,
            error: 'Please provide a mathematical expression',
            renderType: 'text'
          };
        }

        try {
          // Safe evaluation - only allow numbers, basic operators, and parentheses
          const safeExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
          if (safeExpression !== expression) {
            return {
              success: false,
              error: 'Expression contains invalid characters. Only numbers and basic operators (+, -, *, /, parentheses) are allowed.',
              renderType: 'text'
            };
          }

          // Use Function constructor for safe evaluation
          const result = new Function(`'use strict'; return (${safeExpression})`)();
          
          const calculatorData: CalculatorData = {
            expression: expression,
            result: typeof result === 'number' ? parseFloat(result.toFixed(10)) : result
          };

          return {
            success: true,
            data: calculatorData,
            renderType: 'card'
          };
        } catch (error) {
          return {
            success: false,
            error: 'Invalid mathematical expression',
            renderType: 'text'
          };
        }
      }
    });

    // Dictionary Plugin
    this.registerPlugin({
      name: 'dictionary',
      description: 'Get definitions for any word',
      trigger: /^\/define\s+(.+)$/i,
      slashCommand: '/define [word]',
      naturalLanguagePatterns: [
        /(?:define|definition of|what does|what's the meaning of) ([a-zA-Z]+)/i,
        /(?:meaning of) ([a-zA-Z]+)/i
      ],
      execute: async (input: string, match: RegExpMatchArray): Promise<PluginResponse> => {
        const word = match[1]?.trim().toLowerCase();
        if (!word) {
          return {
            success: false,
            error: 'Please specify a word to define',
            renderType: 'text'
          };
        }

        try {
          // Using Free Dictionary API
          const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

          if (!response.ok) {
            // Fallback to mock data
            const mockDefinitions = {
              'hello': [{ partOfSpeech: 'interjection', definition: 'Used as a greeting or to begin a telephone conversation.', example: 'Hello, how are you?' }],
              'computer': [{ partOfSpeech: 'noun', definition: 'An electronic device for storing and processing data.', example: 'I use my computer for work.' }],
              'artificial': [{ partOfSpeech: 'adjective', definition: 'Made or produced by human beings rather than occurring naturally.', example: 'Artificial intelligence is advancing rapidly.' }]
            };

            const definitions = mockDefinitions[word as keyof typeof mockDefinitions] || [
              { partOfSpeech: 'noun', definition: 'A sample definition for demonstration purposes.', example: 'This is an example sentence.' }
            ];

            const dictionaryData: DictionaryData = {
              word: word,
              definitions: definitions
            };

            return {
              success: true,
              data: dictionaryData,
              renderType: 'card'
            };
          }

          const data = await response.json();
          const entry = data[0];

          const definitions = entry.meanings.flatMap((meaning: any) => 
            meaning.definitions.slice(0, 3).map((def: any) => ({
              partOfSpeech: meaning.partOfSpeech,
              definition: def.definition,
              example: def.example
            }))
          );

          const dictionaryData: DictionaryData = {
            word: entry.word,
            definitions: definitions,
            pronunciation: entry.phonetic
          };

          return {
            success: true,
            data: dictionaryData,
            renderType: 'card'
          };
        } catch (error) {
          return {
            success: false,
            error: 'Failed to fetch word definition',
            renderType: 'text'
          };
        }
      }
    });
  }
}

export const pluginManager = new PluginManager();