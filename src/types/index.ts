export interface IProfile {
  id: string
  userId: string
  gender?: string
  fullNameMr?: string
  fullNameEn?: string
  dateOfBirth?: string
  height?: number
  weight?: number
  religion?: string
  caste?: string
  subCaste?: string
  motherTongue?: string
  maritalStatus?: string
  education?: string
  occupation?: string
  income?: string
  village?: string
  taluka?: string
  district?: string
  state?: string
  country?: string
  nativePlace?: string
  aboutMe?: string
  expectations?: string
  isManglik?: boolean
  photoPrivacy?: boolean
  showContact?: boolean
}

export interface IUser {
  id: string
  clerkId?: string
  email?: string
  mobile?: string
  role: string
  membershipTier: string
  verification: string
  isVerified: boolean
  isPremium: boolean
  subscriptionEndDate?: string
  isProfilePublic: boolean
  profileComplete: number
  profileViews: number
  profile?: IProfile
  family?: IFamily
  horoscope?: IHoroscope
  lifestyle?: ILifestyle
  photos?: IPhoto[]
  createdAt: string
}

export interface IFamily {
  fatherName?: string
  motherName?: string
  brothers?: number
  sisters?: number
  familyType?: string
  familyStatus?: string
  familyOrigin?: string
}

export interface IHoroscope {
  nakshatra?: string
  raashi?: string
  manglik?: boolean
}

export interface ILifestyle {
  foodPreference?: string
  smoking?: boolean
  drinking?: boolean
  hobbies?: string
}

export interface IPhoto {
  id: string
  url: string
  isPrimary: boolean
}

/** Lightweight photo item for the UI layer (FileUpload component) */
export interface PhotoItem {
  url: string
  thumbUrl?: string
  isPrimary: boolean
}

export interface IMatch extends IUser {
  compatibilityScore?: number
  matchReason?: string[]
}

export interface IMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  imageUrl?: string
  isRead: boolean
  createdAt: string
}

export interface INotification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface ISearchFilters {
  gender?: string
  ageMin?: number
  ageMax?: number
  heightMin?: number
  heightMax?: number
  religion?: string
  caste?: string
  subCaste?: string
  education?: string
  occupation?: string
  income?: string
  district?: string
  taluka?: string
  village?: string
  manglik?: string
  foodPreference?: string
  maritalStatus?: string
  photoAvailable?: boolean
  verifiedOnly?: boolean
  premiumOnly?: boolean
  recentlyJoined?: boolean
  onlineNow?: boolean
}
