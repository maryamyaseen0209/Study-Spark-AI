import { env } from '../config/env.js';

export async function createZoomMeeting({ title, startsAt, durationMinutes }) {
  if (!env.zoom.enabled) {
    return {
      configured: false,
      providerStatus: 'configuration_required',
      joinUrl: null,
      startUrl: null,
      providerMeetingId: null,
      message: 'Zoom credentials are not configured. Add Zoom env vars to enable live meeting creation.',
    };
  }

  // Placeholder abstraction: credentials are detected, but network creation is intentionally isolated for extension.
  const id = `zoom-${Date.now()}`;
  return {
    configured: true,
    providerStatus: 'configured',
    joinUrl: `${env.clientUrl}/meeting-lobby/${id}`,
    startUrl: `${env.clientUrl}/meeting-host/${id}`,
    providerMeetingId: id,
    message: `Zoom meeting placeholder created for ${title} at ${startsAt.toISOString()} (${durationMinutes} minutes).`,
  };
}