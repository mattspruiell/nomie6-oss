import { derived, writable } from 'svelte/store'

import type { Dayjs } from 'dayjs'
import type { ITrackables } from '../trackable/trackable-utils'
import { LedgerStore } from '../ledger/LedgerStore'
import type NLog from '../nomie-log/nomie-log'
import Stats2Modal from './stats2-modal.svelte'
import type { Stats2TimeSpanType } from './stats2-time-formats'
import type { Trackable } from '../trackable/Trackable.class'
import type { TrackableUsage } from '../usage/trackable-usage.class'
import type { TrackableUsageMap } from '../usage/trackable-usage.class'
import dayjs from 'dayjs'
import logsToTrackableUsage from '../usage/usage-utils'
import { openModal } from '../../components/backdrop/BackdropStore2'
import { wait } from '../../utils/tick/tick'
import { textToId } from '../../utils/text/text'
import { md5 } from '../../modules/nid/nid'

type Stat2StoreProps = {
  loading: boolean
  trackable?: Trackable
  knownTrackables: ITrackables
  usage?: TrackableUsage
  view: 'overview' | 'related' | 'when' | 'where'
  endDate: Date
  time: Stats2TimeSpanType
  logs: Array<NLog>
}

const initialState: Stat2StoreProps = {
  loading: true,
  trackable: undefined,
  knownTrackables: {},
  usage: undefined,
  view: 'overview',
  time: 'm',
  endDate: new Date(),
  logs: [],
}
export const Stats2Store = writable(initialState)

export const Stats2DateRange = derived(Stats2Store, ($Stats2Store) => {
  return getDateRange($Stats2Store.endDate, $Stats2Store.time)
})

const changeStatPeriod = async (amount: number) => {
  let state: any
  Stats2Store.update((s) => {
    s.endDate = nextTimeSpan(s.endDate, s.time, amount)
    s.loading = true
    s.usage = undefined
    state = s
    return s
  })
  await wait(200)
  let range = getDateRange(state.endDate, state.time)
  return await loadStats2Store(range.start, range.end)
}

export const nextStatsPeriod = () => {
  return changeStatPeriod(1)
}

export const previousStatsPeriod = () => {
  return changeStatPeriod(-1)
}

export const changeStats2StoreTime = async (time: Stats2TimeSpanType) => {
  let state
  Stats2Store.update((s) => {
    state = s
    s.loading = true
    s.usage = undefined
    s.time = time
    s.logs = []
    return s
  })
  await wait(200)
  const dateRange = getDateRange(state.endDate, state.time)
  await loadStats2Store(dateRange.start, dateRange.end)
}

const timeSpanToAdditionMap: Record<Stats2TimeSpanType, [number, dayjs.ManipulateType]> = {
  'd': [1, 'day'],
  'w': [1, 'week'],
  'm': [1, 'month'],
  '3m': [3, 'month'],
  '6m': [6, 'month'],
  '1y': [1, 'year'],
}

const nextTimeSpan = (date: Date, timespan: Stats2TimeSpanType, add: number): Date => {
  const [multiplier, unit] = timeSpanToAdditionMap[timespan] || [1, 'month']
  const start = dayjs(date).add(multiplier * add, unit)
  return start.toDate()
}

export const dateRangeToTrackableUsage = async (
  start: Dayjs,
  end: Dayjs,
  known: ITrackables
): Promise<{ usages: TrackableUsageMap; logs: Array<NLog> }> => {
  const logs: Array<NLog> = await LedgerStore.query({
    start: start,
    end: end,
  })
  const usages = logsToTrackableUsage(logs, {
    trackables: known,
  })
  return { usages, logs }
}

export const loadStats2Store = async (start: Dayjs, end: Dayjs) => {
  const state = getRawState()
  const { usages, logs } = await dateRangeToTrackableUsage(start, end, state.knownTrackables)
  Stats2Store.update((s) => {
    s.loading = false
    let usage = usages[s.trackable.tag]
    s.logs = logs.filter((log) => {
      return log.getTrackables({}).find((t) => t.tag === s.trackable.tag)
    })
    if (usage) {
      s.usage = usage
    }
    return s
  })
}

const getRawState = (): Stat2StoreProps => {
  let state: Stat2StoreProps
  Stats2Store.update((s) => {
    state = s
    return s
  })
  return state
}

export const initStatsStore = async (trackable: Trackable, options: OpenStatsOptionType) => {
  let state

  Stats2Store.update((s) => {
    s.trackable = trackable
    s.knownTrackables = options.known
    s.endDate = options.date || new Date()
    s.loading = true
    state = s
    return s
  })
  const dateRange = getDateRange(state.endDate, state.time)
  openModal({
    id: textToId(`stats-${md5(trackable.tag)}`),
    component: Stats2Modal,
    componentProps: {},
  })
  await loadStats2Store(dateRange.start, dateRange.end)
}

// TODO: Make this less if else and based on the Stats2TimeTypes

const timeSpanToSubtractionMap: Record<Stats2TimeSpanType, [number, dayjs.ManipulateType]> = {
  'd': [1, 'day'],
  'w': [6, 'days'],
  'm': [1, 'month'],
  '3m': [3, 'month'],
  '6m': [6, 'month'],
  '1y': [1, 'year'],
}

export const getDateRange = (endDate: Date, timespan: Stats2TimeSpanType): { start: Dayjs; end: Dayjs } => {
  const end = dayjs(endDate)
  const [amount, unit] = timeSpanToSubtractionMap[timespan] || [1, 'month']
  const start = end.subtract(amount, unit)
  return { start, end }
}

type OpenStatsOptionType = {
  known: ITrackables
  date: Date
}

export const openStats2 = (trackable: Trackable, options?: OpenStatsOptionType) => {
  return initStatsStore(trackable, options)
}

export const closeStats2 = () => {
  Stats2Store.update((s) => {
    s.trackable = undefined
    return s
  })
}
