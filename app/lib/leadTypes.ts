export type DoorCondition = "B" | "NEW";
export type OpeningSide = "RIGHT" | "LEFT";
export type LockType = "MAGNETIC" | "REGULAR_101";
export type Hinges = "BOOK" | "PIPE";
export type DoorEdge = "STEP" | "STRAIGHT";
export type Brand = "PANDOOR" | "HAMADIA" | "RAV_BARIACH" | "OREN" | "NO_PREFERENCE";

export type DoorSize = 60 | 70 | 80 | 90;
export type FrameSize = 60 | 70 | 75 | 80 | 90;
export type FrameThickness = 10 | 12 | 14 | 16;

export type ContactPreference = "WHATSAPP" | "CALL";

export type LeadDoorForm = {
  doorCondition: DoorCondition;
  withFrame: boolean;

  frameSize?: FrameSize;
  frameThickness?: FrameThickness;

  openingSide: OpeningSide;

  // חשוב: כשאין משקוף - תמיד REGULAR_101
  lockType: LockType;

  hinges: Hinges;
  doorEdge: DoorEdge;
  brand: Brand;
  doorSize: DoorSize;

  fullName: string;
  phone: string;
  contactPreference: ContactPreference;
};
