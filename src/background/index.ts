import { handleCheckShowAlarm } from './checkShowAlarm'

const CHECK_SHOW_ALARM = 'CheckShow'

function queueCheckShowAlarm(): void {
  void handleCheckShowAlarm().catch((err) =>
    console.error('[CheckShow] Unhandled error:', err),
  )
}

void chrome.alarms.get(CHECK_SHOW_ALARM).then((existing) => {
  if (!existing) {
    void chrome.alarms.create(CHECK_SHOW_ALARM, {
      delayInMinutes: 1440,
      periodInMinutes: 1440,
    })
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === CHECK_SHOW_ALARM) {
    queueCheckShowAlarm()
  }
})

chrome.runtime.onInstalled.addListener(() => {
  queueCheckShowAlarm()
})

console.log('Background script loaded')
