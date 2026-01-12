export type ShipmentStatus = 'PICKED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

export interface Shipment {
  _id: string
  order_id: string | {
    _id: string
    order_number: string
    user_id: string | {
      _id: string
      name: string
      email: string
      phone: string
    }
  }
  shipment_id: string
  awb?: string
  courier_name?: string
  status: ShipmentStatus
  last_tracked_at?: string
  tracking_data?: {
    shipment_status: string
    shipment_track: Array<{
      id: number
      awb_code: string
      courier_name: string
      shipment_status: string
      shipment_status_code: number
      origin: string
      destination: string
      status: string
      updated_time: string
      estimated_delivery_date: string
    }>
    shipment_track_activities: Array<{
      date: string
      status: string
      activity: string
      location: string
    }>
  }
  createdAt?: string
  updatedAt?: string
}

export interface ShippingRate {
  courier_company_id: number
  courier_name: string
  courier_type: string
  rate: number
  estimated_delivery_days: string
  cod_charges?: number
  cod_limit?: number
}

export interface ShippingRateRequest {
  pickup_pincode: string
  delivery_pincode: string
  weight: number
  cod_amount?: number
}
