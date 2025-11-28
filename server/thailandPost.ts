import axios from 'axios';

export interface ThailandPostTrackingItem {
  barcode: string;
  status: string;
  status_description: string;
  status_date: string;
  location: string;
  postcode: string;
  delivery_status: string | null;
  delivery_description: string | null;
  delivery_datetime: string | null;
  receiver_name: string | null;
  signature: string | null;
  status_detail: string;
  delivery_officer_name: string | null;
  delivery_officer_tel: string | null;
  office_name: string | null;
  office_tel: string | null;
  call_center_tel: string;
}

export interface ThailandPostResponse {
  response: {
    items: {
      [barcode: string]: ThailandPostTrackingItem[];
    };
    track_count: {
      track_date: string;
      count_number: number;
      track_count_limit: number;
    };
  };
  message: string;
  status: boolean;
}

const DEFAULT_API_TOKEN = "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6IkF1dGhvcml6YXRpb24iLCJleHAiOjE3NjUzMTgwMzQsInJvbCI6WyJST0xFX1VTRVIiXSwiZCpzaWciOnsicCI6InpXNzB4IiwicyI6bnVsbCwidSI6ImY0MGQyMGYzOTA0OWEzOWVmNzhlOTFjYTczMmIwMWQwIiwiZiI6InhzeiM5In19.4wGiTSp0cZh6L0wLkDVQW0ELz8umM4ozlF5-4jLF3BnnhsYHlkSVaiIbMgrHz2d3uiOpxT8Y1zvWhYLef6ERtw";

export async function trackParcel(
  trackingNumber: string,
  apiToken?: string
): Promise<ThailandPostTrackingItem[]> {
  try {
    const token = apiToken || DEFAULT_API_TOKEN;
    
    const response = await axios.post<ThailandPostResponse>(
      'https://trackapi.thailandpost.co.th/post/api/v1/track',
      {
        status: 'all',
        language: 'EN',
        barcode: [trackingNumber]
      },
      {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status && response.data.response.items[trackingNumber]) {
      return response.data.response.items[trackingNumber];
    }

    return [];
  } catch (error) {
    console.error('[Thailand Post API] Error tracking parcel:', error);
    throw new Error('Failed to track parcel from Thailand Post API');
  }
}

export function getLatestStatus(trackingItems: ThailandPostTrackingItem[]): ThailandPostTrackingItem | null {
  if (trackingItems.length === 0) return null;
  // Latest status is at the end of the array
  return trackingItems[trackingItems.length - 1];
}

export function isDelivered(trackingItems: ThailandPostTrackingItem[]): boolean {
  const latest = getLatestStatus(trackingItems);
  return latest?.delivery_status !== null || latest?.status_description?.toLowerCase().includes('delivered') || false;
}
