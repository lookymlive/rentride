import { ICarContext, ICarState } from '@/models/app';
import { IReqCarProps } from '@/models/req.model';
import { useLocalStorage } from '@mantine/hooks';
import { ReactNode, createContext, useContext } from 'react';

const CarContext = createContext<ICarContext>(undefined as any);

const initialCarState: IReqCarProps = {
  make: '',
  model: '',
  type: 'sedan',
  year: new Date().getFullYear(),
  transmission: 'automatic',
  engineCapacity: '1.0L',
  fuelType: '',
  description: '',
  seatingCapacity: 5,
  numberOfBags: 2,
  numberOfDoors: 4,
  acAvailable: false,
  acWorking: false,
  images: [],
  otherFeatures: [],
  color: '',
  status: 'available',
  provider_id: '',
  country_id: 0,
  region_id: 0,
  pricePerDay: 300,
  minimumRentalPeriodInDays: 1,
  maximumRentalPeriodInDays: '',
};

const initialState: ICarState = initialCarState;

interface Props {
  children: ReactNode;
}
export const CarContextProvider = ({ children }: Props) => {
  const [state, setState] = useLocalStorage<ICarState>({
    key: 'car-go-82AXB76CD',
    defaultValue: initialState,
  });

  const updateProperty = (key: keyof IReqCarProps, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const addInitialState = (state: ICarState) => {
    setState(state);
  };

  const addCarImage = (url: string) => {
    setState((prevState) => ({
      ...prevState,
      images: [...prevState.images, url],
    }));
  };

  const removeImage = (url: string) => {
    setState((prevState) => ({
      ...prevState,
      images: prevState.images.filter((image) => image !== url),
    }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <CarContext.Provider
      value={{
        state: state || initialCarState,
        updateProperty,
        addInitialState,
        addCarImage,
        removeImage,
        resetState,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCarContext = () => {
  const context = useContext(CarContext);
  return context;
};
