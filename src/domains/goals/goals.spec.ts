import { GoalClass } from './goal-class'
import NLog from '../nomie-log/nomie-log'
import TrackerClass from '../../modules/tracker/TrackerClass'
import dayjs from 'dayjs'
import { getDurationFromGoals } from './goal-utils'
import logsToTrackableUsage from '../usage/usage-utils'
import { test, describe, expect } from 'vitest'

// jest.mock('@stripe/firestore-stripe-payments', () => {
//   return {}
// })

// .meta.env.VITE_APP_FIRESTORE_ROOT
describe('Goals!', () => {
  const logs = [
    { end: dayjs('2021-03-07').toDate(), note: `#walk(2) #coffee(1.5)` },
    { end: dayjs('2021-03-08').toDate(), note: `#walk(2)` },
    { end: dayjs('2021-03-09').toDate(), note: `#walk(2)` },
    { end: dayjs('2021-03-10').toDate(), note: `#walk(2)` },
    { end: dayjs('2021-03-11').toDate(), note: `#coffee(5) #water(12) #mood(3)` },
    { end: dayjs('2021-03-12').toDate(), note: `#coffee(1) #mood(4) #walk(4.4)` },
    { end: dayjs('2021-03-13').toDate(), note: `#coffee(3) #water(50) #mood(5)` },
    { end: dayjs('2021-03-16').toDate(), note: `#coffee(2) #mood(6)` },
    { end: dayjs('2021-03-15').toDate(), note: `#coffee(3) #water(100) #mood(7)` },
    { end: dayjs('2021-03-16').toDate(), note: `#coffee(2) #mood(8) #walk(43)` },
    { end: dayjs('2021-03-17').toDate(), note: `#coffee(4) #water(400) #mood(5)` },
    { end: dayjs('2021-04-01').toDate(), note: `#coffee(2) #water(400) #mood(5)` },
    { end: dayjs('2021-04-02').toDate(), note: `#coffee(4.3) #sleep(40000) #mood(2)` },
    { end: dayjs('2021-04-04').toDate(), note: `#coffee(4) #water(400) #mood(5)` },
  ].map((l) => {
    return new NLog({ end: l.end, note: l.note })
  })

  for (let i = 0; i < 100; i++) {
    const date = dayjs('2021-04-04').add(1, 'day')
    const note =
      i % 5 ? `#random${Math.random.toString().replace('0.', '')} Note here` : `#coffee(2) #water(400) #mood(5)`
    logs.push(new NLog({ end: date.toDate(), note }))
  }

  const mood = new TrackerClass({ tag: 'mood', math: 'avg', emoji: '😭' })
  const coffee = new TrackerClass({ tag: 'coffee', math: 'sum', emoji: '☕️' })
  const water = new TrackerClass({ tag: 'water', math: 'sum', emoji: '💦' })
  const walk = new TrackerClass({ tag: 'walk', math: 'sum', emoji: '🚶‍♀️' })
  const empty = new TrackerClass({ tag: 'empty', math: 'sum', emoji: '🚶‍♀️' })

  let trackables = {
    '#mood': mood.toTrackable(),
    '#coffee': coffee.toTrackable(),
    '#water': water.toTrackable(),
    '#walk': walk.toTrackable(),
    '#empty': empty.toTrackable(),
  }

  const usages = logsToTrackableUsage(logs, { trackables })

  let CoffeeGoal = new GoalClass({
    duration: 'day',
    target: 2,
    comparison: 'lte',
    trackable: trackables['#coffee'],
  })

  // let EmptyGoal = new GoalClass({
  //   duration: 'day',
  //   target: 2,
  //   comparison: 'lte',
  //   trackable: trackables['#empty'],
  // })

  let WaterGoal = new GoalClass({
    duration: 'day',
    target: 40,
    comparison: 'gte',
    trackable: trackables['#water'],
  })

  // let WalkGoal = new GoalClass({
  //   duration: 'week',
  //   target: 10,
  //   comparison: 'gte',
  //   trackable: trackables['#walk'],
  // })

  // let WalkMonthGoal = new GoalClass({
  //   duration: 'month',
  //   target: 75,
  //   comparison: 'gte',
  //   trackable: trackables['#walk'],
  // })

  // test('it should get the start and end dates for a group of Goals that has a Month duration', () => {
  //   const shouldBeMonthGoals = [WalkGoal, CoffeeGoal, WaterGoal, WalkMonthGoal]
  //   const monthTimeSpan = getDurationFromGoals(shouldBeMonthGoals)
  //   expect(monthTimeSpan.start.format('YYYY-MM-DD')).toBe(dayjs().startOf('month').format('YYYY-MM-DD'))
  // })

  test('it shoudl be able to calculate the right score for the dont do', () => {
    const scores = CoffeeGoal.calculateScores(usages['#coffee'])
    expect(scores[0].percent).toBe(75)
  })

  test('it should know if its a do it or dont do it goal', () => {
    expect(CoffeeGoal.isDontDoIt).toBe(true)
    expect(WaterGoal.isDontDoIt).toBe(false)
  })

  // test('it should get the start and end dates for a group of Goals that has a Week duration', () => {
  //   const shouldBeWeekGoals = [WalkGoal, CoffeeGoal, WaterGoal]
  //   const weekTimeSpan = getDurationFromGoals(shouldBeWeekGoals)
  //   expect(weekTimeSpan.start.format('YYYY-MM-DD')).toBe(dayjs().startOf('week').format('YYYY-MM-DD'))
  // })

  test('it should get the start and end dates for a group of Goals that has a Day duration - and a custom date', () => {
    const shouldBeDayGoals = [CoffeeGoal, WaterGoal]
    const base = dayjs().add(4, 'day')
    const dayTimespan = getDurationFromGoals(shouldBeDayGoals, base)
    expect(dayTimespan.start.format('YYYY-MM-DD')).toBe(base.startOf('day').format('YYYY-MM-DD'))
  })

  test('it should get the start and end dates for a group of Goals that has a Day duration', () => {
    const shouldBeDayGoals = [CoffeeGoal, WaterGoal]
    const dayTimespan = getDurationFromGoals(shouldBeDayGoals)
    expect(dayTimespan.start.format('YYYY-MM-DD')).toBe(dayjs().startOf('day').format('YYYY-MM-DD'))
  })

  test('it should calculate the day scores for a DONTDOIT goal', () => {
    const scores = CoffeeGoal.calculateScores(usages['#coffee'])
    expect(scores.length).toBeGreaterThan(10)
  })

  // test('it should calculate Month Long Goals', () => {
  //   const scores = WalkGoal.calculateScores(usages['#walk'])
  //   expect(scores.length).toBe(1)
  // })

  test('it should calculate scores for a DO IT GOAL', () => {
    const scores = WaterGoal.calculateScores(usages['#water'])

    // There are 6 instances of #water in the sample logs:
    // 2021-03-11: #water(12) -> success: false (12 >= 40 is false)
    // 2021-03-13: #water(50) -> success: true (50 >= 40 is true)
    // 2021-03-15: #water(100) -> success: true
    // 2021-03-17: #water(400) -> success: true
    // 2021-04-01: #water(400) -> success: true
    // 2021-04-04: #water(400) -> success: true
    // and generated logs add #water(400) for 2021-04-05 -> success: true
    // the indices in the returned scores correspond to the grouped by days:
    // 0: 2021-03-11 (12, success: false)
    // 1: 2021-03-13 (50, success: true)
    // 2: 2021-03-15 (100, success: true)
    // 3: 2021-03-17 (400, success: true)
    // 4: 2021-04-01 (400, success: true)
    // 5: 2021-04-04 (400, success: true)
    // 6: 2021-04-05 (which comes from the auto-generated ones, 400 * 20 = 8000 -> success: true)

    expect(scores.length).toBe(7)

    expect(scores[0].actual).toBe(12)
    expect(scores[0].success).toBe(false)
    expect(scores[0].percent).toBe(30)

    expect(scores[1].actual).toBe(50)
    expect(scores[1].success).toBe(true)
    expect(scores[1].percent).toBe(125)

    expect(scores[5].actual).toBe(400)
    expect(scores[5].success).toBe(true)

    expect(scores[6].actual).toBe(8000)
    expect(scores[6].success).toBe(true)
  })

  test('It should work as na object', () => {
    expect(CoffeeGoal.target).toBe(2)
    expect(CoffeeGoal.duration).toBe('day')
    expect(CoffeeGoal.comparison).toBe('lte')
    expect(CoffeeGoal.trackable).toEqual(trackables['#coffee'])
    expect(GoalClass).toBeTruthy()
  })
})
