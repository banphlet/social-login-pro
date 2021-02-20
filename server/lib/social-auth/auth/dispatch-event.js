const logger = console

export default async function dispatchEvent(event, message) {
  try {
    await event(message)
  } catch (e) {
    logger.error('EVENT_ERROR', e)
  }
}
