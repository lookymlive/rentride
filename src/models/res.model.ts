import {
  IBaseCarType,
  IBaseBookingProps,
  IBaseCarProps,
  IBaseLocationProps,
  IBaseProviderProps,
  IBaseUserProps,
} from './app';

export interface IResCarType extends IBaseCarType {
  id?: number;
  created_at?: string;
}

export interface IResCarProps extends IBaseCarProps {
  id: number;
  created_at: string;
  type: string;
  slug: string;
}

export interface IResProviderProps extends IBaseProviderProps {
  created_at: string;
  country_id: number;
  region_id: number;
  country?: IResCountryProps;
  region?: IResRegionProps;
}

export interface IResBookingProps extends IBaseBookingProps {
  id: number;
  created_at: string;
  cars?: IResCarProps;
}

export interface IResCountryProps extends IBaseLocationProps {
  id: number;
  created_at: string;
}

export interface IResRegionProps extends IResCountryProps {}

export interface IResUserProps extends IBaseUserProps {
  created_at: string;
  countries: IResCountryProps;
  regions: IResRegionProps;
}

export interface IResReviewProps {
  id: number;
  created_at: string;
  rate: number;
  comment: string;
  likes: number;
  dislikes: number;
  car_id: string;
  providers: IResProviderProps;
  users: IResUserProps;
}
