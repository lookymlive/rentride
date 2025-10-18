import { SelectItem } from '@/models/app';
import {
  SiMazda,
  SiVolvo,
  SiVolkswagen,
  SiSubaru,
  SiKia,
  SiHonda,
  SiFord,
  SiChevrolet,
  SiNissan,
  SiToyota,
  SiBmw,
  SiMercedes,
  SiAudi,
  SiHyundai,
  SiJeep,
  SiTesla,
} from 'react-icons/si';

export const carMakes: SelectItem[] = [
  {
    label: 'Toyota',
    value: 'Toyota',
    icon: SiToyota,
  },
  {
    label: 'Honda',
    value: 'Honda',
    icon: SiHonda,
  },
  {
    label: 'Ford',
    value: 'Ford',
    icon: SiFord,
  },
  {
    label: 'Chevrolet',
    value: 'Chevrolet',
    icon: SiChevrolet,
  },
  {
    label: 'Nissan',
    value: 'Nissan',
    icon: SiNissan,
  },
  {
    label: 'BMW',
    value: 'BMW',
    icon: SiBmw,
  },
  {
    label: 'Mercedes Benz',
    value: 'Mercedes Benz',
    icon: SiMercedes,
  },
  {
    label: 'Audi',
    value: 'Audi',
    icon: SiAudi,
  },
  {
    label: 'Hyundai',
    value: 'Hyundai',
    icon: SiHyundai,
  },
  {
    label: 'Kia',
    value: 'Kia',
    icon: SiKia,
  },
  {
    label: 'Lexus',
    value: 'Lexus',
    icon: '',
  },
  {
    label: 'Subaru',
    value: 'Subaru',
    icon: SiSubaru,
  },
  {
    label: 'Volkswagen',
    value: 'Volkswagen',
    icon: SiVolkswagen,
  },
  {
    label: 'Volvo',
    value: 'Volvo',
    icon: SiVolvo,
  },
  {
    label: 'Mazda',
    value: 'Mazda',
    icon: SiMazda,
  },
  {
    label: 'Jeep',
    value: 'Jeep',
    icon: SiJeep,
  },
  {
    label: 'Tesla',
    value: 'Tesla',
    icon: SiTesla,
  },
];
