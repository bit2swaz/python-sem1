// Define an enum for crop types to make the code more readable and prevent magic numbers
export enum CropType {
  Rice = 1,
  Wheat = 2,
  Maize = 3,
}

// Interface to define the structure of crop details for output
export interface CropDetails {
  type: string;
  yieldAmount: number;
  marketRate: number;
  subsidy: number;
}
