type TimeType = {
  type: Stats2TimeSpanType
  label: string
  unit: string
  format: string
  groupByFormat: string
}

export const Stats2TimeTypes: { [key: string]: TimeType } = {
  d: {
    type: 'd',
    label: 'Day',
    unit: 'day',
    format: 'YYYY-MM-DD',
    groupByFormat: 'YYYY-MM-DD',
  },
  w: {
    type: 'w',
    label: 'Week',
    unit: 'week',
    format: 'YYYY-MM-W',
    groupByFormat: 'YYYY-MM-W',
  },
  m: {
    type: 'm',
    label: 'Month',
    unit: 'month',
    format: 'YYYY-MM-DD',
    groupByFormat: 'YYYY-MM-DD',
  },
  '3m': {
    type: '3m',
    label: '3 Months',
    unit: 'day',
    format: 'YYYY-MM-DD',
    groupByFormat: 'YYYY-MM-DD',
  },
  '6m': {
    type: '6m',
    label: '6 Months',
    unit: 'month',
    format: 'YYYY-MM-DD',
    groupByFormat: 'YYYY-MM-W',
  },
  '1y': {
    type: '1y',
    label: '1 year',
    unit: 'year',
    format: 'YYYY-MM-DD',
    groupByFormat: 'YYYY-MM-W',
  },
}

export type Stats2TimeSpanType = 'd' | 'w' | 'm' | '3m' | '6m' | '1y'

export type Stats2TimeTypeExpanded = {
  type: string
  label: string
  unit: string
  format: string
  groupByFormat: string
}

export const expandStats2TimeType = (type: Stats2TimeSpanType): Stats2TimeTypeExpanded | undefined => {
  return Stats2TimeTypes[type]
}
