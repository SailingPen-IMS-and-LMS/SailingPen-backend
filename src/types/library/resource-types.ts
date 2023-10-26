export type CloudFlareStreamUploadResult = {
  result: {
    uid: string;
    creator: null | string;
    thumbnail: string;
    thumbnailTimestampPct: number;
    readyToStream: boolean;
    readyToStreamAt: null | string;
    status: {
      state: 'queued' | Omit<string, 'queued'>;
      errorReasonCode: string;
      errorReasonText: string;
    };
    meta: { name: string };
    created: string;
    modified: string;
    scheduledDeletion: null | string;
    size: number;
    preview: string;
    allowedOrigins: string[];
    requireSignedURLs: boolean;
    uploaded: string;
    uploadExpiry: null | string;
    maxSizeBytes: null | string;
    maxDurationSeconds: number;
    duration: number;
    input: { width: number; height: number };
    playback: {
      hls: string;
      dash: string;
    };
    watermark: null | string;
    clippedFrom: null | string;
    publicDetails: null | string;
  };
  success: boolean;
  errors: string[];
  messages: string[];
};
