import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RoomAvailabilityManagementTemplate from './RoomAvailabilityManagementTemplate';
import RoomAvailabilityService from '../../services/hotel/RoomAvailabilityService';
import RoomService from '../../services/hotel/RoomService';
import { IRoomAvailability, RoomPriceAndAvailabilityItem } from '../../interfaces/model/Hotel/IRoomAvailability';
import { RoomAvailabilityPrice, RoomListProps } from '../../interfaces/DTO/Hotel/IHotelProps';

const RoomAvailabilityManagement: React.FC<RoomListProps> = ({ hotelId, hotel }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [rooms, setRooms] = useState<RoomAvailabilityPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const currencies = ['BRL', 'USD', 'EUR', 'GBP'];

  useEffect(() => {
    if (hotelId) {
      loadRooms(hotelId);
    }
  }, [hotelId, hotel]);

  const loadRooms = async (hotelId: number) => {
    try {
      setIsLoading(true);
      const response = await RoomService.getRoomsByHotelId(hotelId);

      if (response.success && response.data) {
        const formattedRooms = response.data.map(room => ({
          id: room.id,
          name: room.description, //TODO: CREATE NAME ROOM 
          quantity: 0,
          currency: 'BRL',
          prices: weekDays.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
          }, {} as { [key: string]: number })
        }));

        setRooms(formattedRooms);
      } else {
        toast.error('Erro ao carregar quartos do hotel');
      }
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      toast.error('Erro ao carregar quartos do hotel');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailabilities = async () => {
    if (!hotelId || !startDate || !endDate) {
      toast.warning('Por favor, selecione as datas inicial e final');
      return;
    } 
    try {
      setIsLoading(true);
      const searchCriteria = {
        hotelId: hotelId,
        startDate,
        endDate
      };
  
      const response = await RoomAvailabilityService.getAvailabilitiesBySearchCriteria(searchCriteria);
      
      if (response.success && response.data) {
        // Map existing availabilities to rooms
        const updatedRooms = [...rooms];
  
        if (response.data.length === 0) {
          toast.info('Nenhuma disponibilidade encontrada para o período selecionado. Configure novas disponibilidades.');
          return;
        }
  
        response.data.forEach(availability => {
          const roomIndex = updatedRooms.findIndex(r => r.id === availability.roomId);
          if (roomIndex !== -1) {
            // Set currency from first availability item
            if (availability.availabilityWithPrice.length > 0) {
              updatedRooms[roomIndex].currency = availability.availabilityWithPrice[0].currency;
              updatedRooms[roomIndex].quantity = availability.availabilityWithPrice[0].quantityAvailable;
            }
  
            // Map prices by day of week
            availability.availabilityWithPrice.forEach(item => {
              updatedRooms[roomIndex].prices[item.dayOfWeek] = item.price;
            });
          }
        });
  
        setRooms(updatedRooms); 
        toast.success('Disponibilidades carregadas com sucesso!');
      } else {
        toast.error(response.message || 'Falha ao carregar disponibilidades. Verifique os parâmetros de busca.');
      }
    } catch (error) {
      console.error('Erro ao carregar disponibilidades:', error);
      toast.error('Erro ao carregar disponibilidades dos quartos. Verifique sua conexão ou tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (startDate && endDate) {
      loadAvailabilities();
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
  };

  const handleQuantityChange = (roomId: number, quantity: number) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, quantity } : room
      )
    );
  };

  const handleCurrencyChange = (roomId: number, currency: string) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, currency } : room
      )
    );
  };

  const handlePriceChange = (roomId: number, day: string, price: number) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId
          ? { ...room, prices: { ...room.prices, [day]: price } }
          : room
      )
    );
  };

  const handleSave = async () => {
    if (!startDate || !endDate) {
      toast.warning('Por favor, selecione as datas inicial e final');
      return;
    }

    // Validate inputs
    for (const room of rooms) {
      if (room.quantity <= 0) {
        toast.warning(`Por favor, defina uma quantidade válida para o quarto ${room.name}`);
        return;
      }

      for (const day of weekDays) {
        if (room.prices[day] <= 0) {
          toast.warning(`Por favor, defina um preço válido para ${day} no quarto ${room.name}`);
          return;
        }
      }
    }

    try {
      setIsLoading(true);

      // Prepare data for batch creation
      const availabilities: IRoomAvailability[] = rooms.map(room => {
        const availabilityWithPrice: RoomPriceAndAvailabilityItem[] = weekDays.map(day => ({
          dayOfWeek: day,
          price: room.prices[day],
          quantityAvailable: room.quantity,
          currency: room.currency,
          status: 'Available'
        }));

        return {
          id: 0, // New availability
          roomId: room.id,
          startDate,
          endDate,
          availabilityWithPrice
        };
      });

      const response = await RoomAvailabilityService.createBatch(availabilities);

      if (response.success) {
        toast.success('Disponibilidades salvas com sucesso!');
        // Load availabilities after saving
        loadAvailabilities();
      } else {
        toast.error(response.message || 'Erro ao salvar disponibilidades');
      }
    } catch (error) {
      console.error('Erro ao salvar disponibilidades:', error);
      toast.error('Erro ao salvar disponibilidades dos quartos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back or reset form
    navigate(-1);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.warning('Por favor, selecione as datas inicial e final para a pesquisa');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('A data inicial não pode ser posterior à data final');
      return;
    }
    
    toast.info('Buscando disponibilidades...');
    loadAvailabilities();
  };
  

  return (
    <RoomAvailabilityManagementTemplate
      hotel={hotel} 
      startDate={startDate}
      endDate={endDate}
      rooms={rooms}
      currencies={currencies}
      weekDays={weekDays}
      isLoading={isLoading} 
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onQuantityChange={handleQuantityChange}
      onCurrencyChange={handleCurrencyChange}
      onPriceChange={handlePriceChange}
      onSave={handleSave}
      onCancel={handleCancel}
      onSearch={handleSearch}
    />
  );
};

export default RoomAvailabilityManagement;
