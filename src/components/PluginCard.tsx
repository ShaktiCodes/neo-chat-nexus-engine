import { WeatherData, CalculatorData, DictionaryData } from '../types/chat';
import { Cloud, Sun, CloudRain, Calculator, Book, Thermometer, Droplets, Wind } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface PluginCardProps {
  pluginName: string;
  data: any;
}

export const PluginCard = ({ pluginName, data }: PluginCardProps) => {
  switch (pluginName) {
    case 'weather':
      return <WeatherCard data={data} />;
    case 'calculator':
      return <CalculatorCard data={data} />;
    case 'dictionary':
      return <DictionaryCard data={data} />;
    default:
      return (
        <div className="text-muted-foreground">
          Unknown plugin: {pluginName}
        </div>
      );
  }
};

const WeatherCard = ({ data }: { data: WeatherData }) => {
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return CloudRain;
    if (desc.includes('cloud')) return Cloud;
    return Sun;
  };

  const WeatherIcon = getWeatherIcon(data.description);

  return (
    <Card className="bg-gradient-card border-neon-blue/20 shadow-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-neon-cyan">
          <WeatherIcon className="h-5 w-5" />
          Weather in {data.location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-neon-blue" />
            <span className="text-2xl font-bold">{data.temperature}°C</span>
          </div>
          <div className="text-right">
            <div className="text-lg capitalize">{data.description}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-neon-cyan" />
            <span>Humidity: {data.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-neon-cyan" />
            <span>Wind: {data.windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CalculatorCard = ({ data }: { data: CalculatorData }) => {
  return (
    <Card className="bg-gradient-card border-neon-purple/20 shadow-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-neon-purple">
          <Calculator className="h-5 w-5" />
          Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Expression: <code className="bg-muted px-2 py-1 rounded text-foreground">{data.expression}</code>
          </div>
          <div className="text-2xl font-bold text-neon-purple">
            Result: {typeof data.result === 'number' ? data.result.toLocaleString() : data.result}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DictionaryCard = ({ data }: { data: DictionaryData }) => {
  return (
    <Card className="bg-gradient-card border-neon-cyan/20 shadow-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-neon-cyan">
          <Book className="h-5 w-5" />
          {data.word}
          {data.pronunciation && (
            <span className="text-sm text-muted-foreground font-normal">
              {data.pronunciation}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.definitions.map((def, index) => (
            <div key={index} className="border-l-2 border-neon-cyan/30 pl-3">
              <div className="text-sm font-medium text-neon-cyan mb-1">
                {def.partOfSpeech}
              </div>
              <div className="text-sm mb-2">
                {def.definition}
              </div>
              {def.example && (
                <div className="text-xs text-muted-foreground italic">
                  "{def.example}"
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};