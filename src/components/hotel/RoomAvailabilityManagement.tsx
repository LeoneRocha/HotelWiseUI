import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment'; 
import RoomAvailabilityManagementTemplate from './RoomAvailabilityManagementTemplate';
import RoomAvailabilityService from '../../services/hotel/RoomAvailabilityService';
import RoomService from '../../services/hotel/RoomService';
import CurrencyService from '../../services/CurrencyService';
import DateService from '../../services/DateService';
import { IRoomAvailability, RoomPriceAndAvailabilityItem } from '../../interfaces/model/Hotel/IRoomAvailability';
import { RoomAvailabilityPrice, RoomListProps } from '../../interfaces/DTO/Hotel/IHotelProps';
import { RoomAvailabilityStatus } from '../../enums/hotel/RoomStatus';

const RoomAvailabilityManagement: React.FC<RoomListProps> = ({ hotelId, hotel }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [rooms, setRooms] = useState<RoomAvailabilityPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // Obter dias da semana localizados usando o serviço
  const weekDays = DateService.getLocalizedWeekdays();
  
  // Obter moedas disponíveis usando o serviço
  const currencies = CurrencyService.getAvailableCurrencies();

  useEffect(() => {
    // Configurar o locale do moment
    moment.locale(navigator.language || 'pt-br');
    
    if (hotelId) {
      loadRooms(hotelId);
    }
  }, [hotelId, hotel]);

  // Validate form and update save button state
  useEffect(() => {
    validateForm();
  }, [startDate, endDate, rooms]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Validate dates
    if (!startDate) {
      errors.startDate = 'Data inicial é obrigatória';
    }
    
    if (!endDate) {
      errors.endDate = 'Data final é obrigatória';
    }
    
    if (!DateService.isValidDateRange(startDate, endDate)) {
      errors.dateRange = 'A data inicial não pode ser posterior à data final';
    }
    
    // Check if at least one room is fully configured
    let hasConfiguredRoom = false;
    
    rooms.forEach((room) => {
      const roomKey = `room_${room.id}`;
      const isRoomConfigured = room.quantity > 0 && 
        weekDays.every(day => room.prices[day] > 0) && 
        room.currency;
      
      if (isRoomConfigured) {
        hasConfiguredRoom = true;
      } else if (room.quantity > 0 || weekDays.some(day => room.prices[day] > 0)) {
        // If room is partially configured, mark errors
        if (room.quantity <= 0) {
          errors[`${roomKey}_quantity`] = 'Quantidade inválida';
        }
        
        weekDays.forEach(day => {
          if (room.prices[day] <= 0) {
            errors[`${roomKey}_price_${day}`] = 'Preço inválido';
          }
        });
      }
    });
    
    // Update form errors
    setFormErrors(errors);
    
    // Enable save button if no errors and at least one room is configured
    setIsSaveEnabled(
      Object.keys(errors).length === 0 && 
      startDate !== '' && 
      endDate !== '' && 
      hasConfiguredRoom
    );
  };

  const loadRooms = async (hotelId: number) => {
    try {
      setIsLoading(true);
      const response = await RoomService.getRoomsByHotelId(hotelId);

      if (response.success && response.data) {
        const defaultCurrency = CurrencyService.getDefaultCurrency().code;
        
        const formattedRooms = response.data.map(room => ({
          id: room.id,
          name: room.description, //TODO: CREATE NAME ROOM 
          quantity: 0,
          currency: defaultCurrency,
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
    if (!isSaveEnabled) {
      toast.warning('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for batch creation
      const availabilities: IRoomAvailability[] = rooms
        .filter(room => room.quantity > 0 && weekDays.every(day => room.prices[day] > 0))
        .map(room => {
          const availabilityWithPrice: RoomPriceAndAvailabilityItem[] = weekDays.map(day => ({
            dayOfWeek: day,
            price: room.prices[day],
            quantityAvailable: room.quantity,
            currency: room.currency,
            status:  RoomAvailabilityStatus.Available
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
    
    if (!DateService.isValidDateRange(startDate, endDate)) {
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
      formErrors={formErrors}
      isSaveEnabled={isSaveEnabled}
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
