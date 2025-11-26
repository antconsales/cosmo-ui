import type { Meta, StoryObj } from "@storybook/react";
import { WeatherWidget } from "@cosmo/renderer-web";
import type { WeatherWidget as WeatherWidgetType } from "@cosmo/core-schema";

const meta: Meta<typeof WeatherWidget> = {
  title: "Components/System/WeatherWidget",
  component: WeatherWidget,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
};

export default meta;
type Story = StoryObj<typeof WeatherWidget>;

const baseWeather: WeatherWidgetType = {
  id: "weather-1",
  location: "San Francisco",
  temperature: 22,
  unit: "celsius",
  feelsLike: 20,
  condition: "partly-cloudy",
  humidity: 65,
  windSpeed: 12,
  windDirection: "NW",
  variant: "default",
  size: "medium",
};

export const Default: Story = {
  args: {
    weather: baseWeather,
  },
};

export const Clear: Story = {
  args: {
    weather: { ...baseWeather, condition: "clear", temperature: 28 },
  },
};

export const Cloudy: Story = {
  args: {
    weather: { ...baseWeather, condition: "cloudy", temperature: 18 },
  },
};

export const Rain: Story = {
  args: {
    weather: { ...baseWeather, condition: "rain", temperature: 15 },
  },
};

export const Thunderstorm: Story = {
  args: {
    weather: { ...baseWeather, condition: "thunderstorm", temperature: 19 },
  },
};

export const Snow: Story = {
  args: {
    weather: { ...baseWeather, condition: "snow", temperature: -2 },
  },
};

export const Fog: Story = {
  args: {
    weather: { ...baseWeather, condition: "fog", temperature: 12 },
  },
};

export const SmallSize: Story = {
  args: {
    weather: { ...baseWeather, size: "small" },
  },
};

export const LargeSize: Story = {
  args: {
    weather: { ...baseWeather, size: "large" },
  },
};

export const CompactVariant: Story = {
  args: {
    weather: { ...baseWeather, variant: "compact" },
  },
};

export const DetailedVariant: Story = {
  args: {
    weather: {
      ...baseWeather,
      variant: "detailed",
      uvIndex: 6,
      airQuality: 42,
      sunrise: "06:32",
      sunset: "19:45",
    },
  },
};

export const GlassVariant: Story = {
  args: {
    weather: { ...baseWeather, variant: "glass" },
  },
};

export const Fahrenheit: Story = {
  args: {
    weather: { ...baseWeather, unit: "fahrenheit", temperature: 72 },
  },
};

export const WithHourlyForecast: Story = {
  args: {
    weather: {
      ...baseWeather,
      variant: "detailed",
      hourlyForecast: [
        { time: "14:00", temperature: 22, condition: "partly-cloudy" },
        { time: "15:00", temperature: 23, condition: "clear" },
        { time: "16:00", temperature: 24, condition: "clear" },
        { time: "17:00", temperature: 22, condition: "partly-cloudy" },
      ],
    },
  },
};
