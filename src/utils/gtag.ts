export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
// @ts-expect-error
export const pageView = (url: string): void => window.gtag('config', GA_TRACKING_ID, { page_path: url });

export interface AnalyticsEvent {
  action: string;
  category: string;
  label: string;
  value: string;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: AnalyticsEvent) =>
  window.gtag('event', action, { event_category: category, event_label: label, value });
