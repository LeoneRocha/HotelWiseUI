 
  export interface IHotel {
    
    hotelId: number;
    hotelName: string;
    description: string;
    tags: string[];
    stars: number;
    initialRoomPrice: number;
    zipCode: string;
    location: string;
    city: string;
    stateCode: string;
    score: number;
    isHotelInVectorStore: boolean;
  }