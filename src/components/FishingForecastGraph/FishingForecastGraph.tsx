import { useState, useMemo } from 'react'
import type { HourlyFishingForecast } from '../../types/index.ts'
import { t } from '../../i18n/useTranslation.ts'
import styles from './FishingForecastGraph.module.css'

interface FishingForecastGraphProps {
  hourlyForecasts: HourlyFishingForecast[]
}

function getBarColor(score: number): string {
  if (score < 40) return styles.barPoor
  if (score < 60) return styles.barFair
  if (score < 80) return styles.barGood
  return styles.barExcellent
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}

export function FishingForecastGraph({ hourlyForecasts }: FishingForecastGraphProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: HourlyFishingForecast } | null>(null)

  const forecastData = useMemo(() => hourlyForecasts ?? [], [hourlyForecasts])

  const dimensions = useMemo(() => {
    const width = 700
    const height = 200
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    return { width, height, padding, chartWidth, chartHeight }
  }, [])

  const pathData = useMemo(() => {
    if (forecastData.length === 0) return ''

    const { chartWidth, chartHeight, padding } = dimensions
    const barWidth = chartWidth / forecastData.length

    const points = forecastData.map((forecast, i) => {
      const x = padding.left + i * barWidth + barWidth / 2
      const y = padding.top + chartHeight - (forecast.score / 100) * chartHeight
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }, [forecastData, dimensions])

  const bars = useMemo(() => {
    if (forecastData.length === 0) return []

    const { chartWidth, chartHeight, padding } = dimensions
    const barWidth = Math.max(8, (chartWidth / forecastData.length) - 4)

    return forecastData.map((forecast, i) => {
      const x = padding.left + i * (chartWidth / forecastData.length) + 2
      const barHeight = (forecast.score / 100) * chartHeight
      const y = padding.top + chartHeight - barHeight

      return {
        x,
        y,
        width: barWidth,
        height: barHeight,
        forecast,
      }
    })
  }, [forecastData, dimensions])

  const yTicks = [0, 25, 50, 75, 100]
  const xTicks = forecastData.filter((_, i) => i % 2 === 0)

  if (forecastData.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{t('hourlyForecast')}</h3>
        <div className={styles.noData}>No hourly data available</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('hourlyForecast')}</h3>
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className={styles.graph}
      >
        <line
          x1={dimensions.padding.left}
          y1={dimensions.padding.top}
          x2={dimensions.padding.left}
          y2={dimensions.padding.top + dimensions.chartHeight}
          className={styles.yAxis}
        />
        <line
          x1={dimensions.padding.left}
          y1={dimensions.padding.top + dimensions.chartHeight}
          x2={dimensions.padding.left + dimensions.chartWidth}
          y2={dimensions.padding.top + dimensions.chartHeight}
          className={styles.xAxis}
        />

        {yTicks.map((tick) => {
          const y = dimensions.padding.top + dimensions.chartHeight - (tick / 100) * dimensions.chartHeight
          return (
            <g key={`y-${tick}`}>
              <line
                x1={dimensions.padding.left}
                y1={y}
                x2={dimensions.padding.left + dimensions.chartWidth}
                y2={y}
                className={styles.gridLine}
              />
              <text
                x={dimensions.padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className={styles.axisLabel}
              >
                {tick}
              </text>
            </g>
          )
        })}

        {xTicks.map((forecast) => {
          const index = forecastData.indexOf(forecast)
          const x = dimensions.padding.left + index * (dimensions.chartWidth / forecastData.length) + (dimensions.chartWidth / forecastData.length) / 2
          return (
            <text
              key={`x-${forecast.time}`}
              x={x}
              y={dimensions.padding.top + dimensions.chartHeight + 16}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {formatHour(forecast.hour)}
            </text>
          )
        })}

        <text
          x={15}
          y={dimensions.height / 2}
          transform={`rotate(-90, 15, ${dimensions.height / 2})`}
          className={styles.axisLabel}
          style={{ fontSize: '12px' }}
        >
          Score
        </text>

        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
          />
        )}

        {bars.map((bar, i) => (
          <rect
            key={`bar-${i}`}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            className={`${styles.bar} ${getBarColor(bar.forecast.score)}`}
            rx="2"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
                data: bar.forecast,
              })
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div><strong>{formatHour(tooltip.data.hour)}</strong></div>
          <div>Score: {tooltip.data.score}/100</div>
          <div>Temp: {tooltip.data.temperature}°C</div>
          <div>Wind: {tooltip.data.windSpeed} km/h</div>
        </div>
      )}
    </div>
  )
}
