export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Create Event',
      route: '/events/create',
    },
    {
      label: 'My Profile',
      route: '/profile',
    },
  ]
  
  type WalletChain = {
    id: string;
    name: string;
    network: string;
    networkUrl: string;
  };

  const publicWallet: WalletChain = {
    id: "public",
    name: "Public Chain",
    network: "public-network",
    networkUrl: "https://public-network.com",
  };
  
  
  export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: '',
    price: '',
    isFree: false,
    url: '',
    
  }
  