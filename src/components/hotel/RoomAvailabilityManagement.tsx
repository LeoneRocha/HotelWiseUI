import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import RoomAvailabilityManagementTemplate from './RoomAvailabilityManagementTemplate';
import RoomAvailabilityService from '../../services/hotel/RoomAvailabilityService';
import RoomService from '../../services/hotel/RoomService';
import CurrencyService from '../../services/CurrencyService';
import DateService from '../../services/DateService';
import { IRoomAvailability, RoomAvailabilitySearchDto, RoomPriceAndAvailabilityItem } from '../../interfaces/model/Hotel/IRoomAvailability';
import { RoomAvailabilityPrice, RoomListProps } from '../../interfaces/DTO/Hotel/IHotelProps';
import { RoomAvailabilityStatus } from '../../enums/hotel/RoomStatus';
import { DayOfWeekHelper } from '../../helpers/DayOfWeekHelper';

const RoomAvailabilityManagement: React.FC<RoomListProps> = ({ hotelId, hotel }) => {
  // Configura o locale do moment
  moment.locale('pt-br');

  const navigate = useNavigate();
  // Changed from string to Date
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchCurrency, setSearchCurrency] = useState<string>('');
  const [rooms, setRooms] = useState<RoomAvailabilityPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);
  const [returnedStartDate, setReturnedStartDate] = useState<Date>(new Date());
  const [returnedEndDate, setReturnedEndDate] = useState<Date>(new Date());
  const [hasSearchResults, setHasSearchResults] = useState<boolean>(false);
  // Obter dias da semana localizados usando o serviço
  const weekDays = DateService.getLocalizedWeekdays();

  // Create mapping between localized weekday names and .NET DayOfWeek enum values
  const dayOfWeekMap = DayOfWeekHelper.createWeekDayToDotNetMap(weekDays);

  // Obter moedas disponíveis usando o serviço
  const currencies = CurrencyService.getAvailableCurrencies();

  useEffect(() => {
    // Configurar o locale do moment
    moment.locale(navigator.language || 'pt-br');

    // Set default currency
    setSearchCurrency(CurrencyService.getDefaultCurrency().code);

    if (hotelId && !isLoading) {
      loadRoomsForAvailability(hotelId);
    }
  }, [hotelId]);

  // Validate form and update save button state
  useEffect(() => {
    validateForm();
  }, [startDate, endDate, searchCurrency, rooms]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validate dates
    if (!startDate) {
      errors.startDate = 'Data inicial é obrigatória';
    }

    if (!endDate) {
      errors.endDate = 'Data final é obrigatória';
    }

    if (!searchCurrency) {
      errors.searchCurrency = 'Moeda é obrigatória';
    }

    if (startDate && endDate && moment(startDate).isAfter(moment(endDate))) {
      errors.dateRange = 'A data inicial não pode ser posterior à data final';
    }

    // Check if at least one room is fully configured
    let hasConfiguredRoom = false;

    rooms.forEach((room) => {
      const roomKey = `room_${room.id}`;
      const isRoomConfigured = room.quantity > 0 &&
        weekDays.every(day => room.prices[day] > 0);

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
      startDate !== null &&
      endDate !== null &&
      searchCurrency !== '' &&
      hasConfiguredRoom
    );
  };

  const loadRoomsForAvailability = async (hotelId: number) => {
    try {
      setIsLoading(true);
      const response = await RoomService.getRoomsByHotelId(hotelId);
      if (response.success && response.data) {
        const defaultCurrency = searchCurrency || CurrencyService.getDefaultCurrency().code;
        const formattedRooms: RoomAvailabilityPrice[] = response.data.map((room, index) => ({
          key: index, // Add sequential key 
          roomId: room.id,
          id: room.id,
          roomAvailabilityId: 0,
          name: room.name,
          quantity: 0,
          currency: defaultCurrency,
          prices: weekDays.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
          }, {} as { [key: string]: number })
        }));
        // Sort rooms by name before setting state
        const sortedRooms = formattedRooms.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setRooms(sortedRooms);
      } else {
        toast.warning(response.message + ' Para a disponibilidade.' || 'Nenhum quarto encontrado para este hotel para a disponibilidade.');
        setRooms([]); // Clear rooms if no data found
      }
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      toast.error('Erro ao carregar quartos do hotel para a disponibilidade. Verifique sua conexão ou tente novamente mais tarde.');
      setRooms([]); // Clear rooms on error
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailabilities = async () => {
    if (!hotelId || !startDate || !endDate || !searchCurrency) {
      toast.warning('Por favor, preencha todos os campos de busca');
      return;
    }
    try {
      setIsLoading(true);
      const searchCriteria: RoomAvailabilitySearchDto = {
        hotelId: hotelId,
        startDate: moment(startDate).toDate(),
        endDate: moment(endDate).toDate(),
        currency: searchCurrency
      };
      const response = await RoomAvailabilityService.getAvailabilitiesBySearchCriteria(searchCriteria);
      if (response.success && response.data) {
        // Map existing availabilities to rooms
        const updatedRooms = [...rooms];

        if (response.data.length === 0) {
          toast.info('Nenhuma disponibilidade encontrada para o período selecionado. Configure novas disponibilidades.');
          return;
        }
        setHasSearchResults(true);
        // Convert string dates to Date objects using moment
        setReturnedStartDate(moment(response.data[0].startDate).toDate());
        setReturnedEndDate(moment(response.data[0].endDate).toDate());

        response.data.forEach(availability => {
          const roomIndex = updatedRooms.findIndex(r => r.roomId === availability.roomId);
          if (roomIndex !== -1) {
            // Set currency from first availability item or from search currency
            if (availability.availabilityWithPrice.length > 0) {
              updatedRooms[roomIndex].currency = searchCurrency;
              updatedRooms[roomIndex].roomId = availability.roomId;
              updatedRooms[roomIndex].roomAvailabilityId = availability.id
              updatedRooms[roomIndex].id = availability.id
              updatedRooms[roomIndex].quantity = availability.availabilityWithPrice[0].quantityAvailable;
            }

            // Map prices by day of week
            availability.availabilityWithPrice.forEach(item => {
              // Convert .NET DayOfWeek enum value to localized day name
              const localizedDay = DayOfWeekHelper.toLocalizedDay(
                item.dayOfWeek,
                weekDays,
                dayOfWeekMap
              );

              updatedRooms[roomIndex].prices[localizedDay] = item.price;
            });
          }
        });
        setRooms(updatedRooms);
        toast.success('Disponibilidades carregadas com sucesso!');
      } else {
        setHasSearchResults(false);
        toast.error(response.message || 'Falha ao carregar disponibilidades. Verifique os parâmetros de busca.');
      }
    } catch (error) {
      setHasSearchResults(false);
      console.error('Erro ao carregar disponibilidades:', error);
      toast.error('Erro ao carregar disponibilidades dos quartos. Verifique sua conexão ou tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDateChange = (dateStr: string) => {
    // Convert string to Date using moment
    const date = dateStr ? moment(dateStr).toDate() : null;
    setStartDate(date);
  };

  const handleEndDateChange = (dateStr: string) => {
    // Convert string to Date using moment
    const date = dateStr ? moment(dateStr).toDate() : null;
    setEndDate(date);
  };

  const handleSearchCurrencyChange = (currency: string) => {
    setSearchCurrency(currency);

    // Atualiza a moeda de todos os quartos quando a moeda de busca muda
    setRooms(prevRooms =>
      prevRooms.map(room => ({
        ...room,
        currency
      }))
    );
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

      // Use returnedStartDate and returnedEndDate if available, otherwise use the form dates
      // For new periods (when hasSearchResults is false), use the form dates
      // Otherwise, use the returned dates from the search
      const startDateToUse = hasSearchResults ? returnedStartDate : startDate ?? new Date();
      const endDateToUse = hasSearchResults ? returnedEndDate : endDate ?? new Date();

      // Prepare data for batch creation
      const availabilities: IRoomAvailability[] = rooms
        .filter(room => room.quantity > 0 && weekDays.every(day => room.prices[day] > 0))
        .map(room => {
          const availabilityWithPrice: RoomPriceAndAvailabilityItem[] = weekDays.map(day => ({
            dayOfWeek: DayOfWeekHelper.toDotNetDayOfWeek(day, dayOfWeekMap), // Convert to .NET DayOfWeek enum
            price: room.prices[day],
            quantityAvailable: room.quantity,
            currency: searchCurrency, // Use searchCurrency instead of room.currency
            status: RoomAvailabilityStatus.Available
          }));

          return {
            id: room.roomAvailabilityId,
            roomId: room.roomId,
            startDate: startDateToUse,
            endDate: endDateToUse,
            currency: searchCurrency, // Use searchCurrency instead of room.currency
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
    if (!startDate || !endDate || !searchCurrency) {
      toast.warning('Por favor, preencha todos os campos de busca');
      return;
    }

    if (moment(startDate).isAfter(moment(endDate))) {
      toast.error('A data inicial não pode ser posterior à data final');
      return;
    }

    toast.info('Buscando disponibilidades...');
    loadAvailabilities();
  };
  const handleNewPeriod = () => {
    // Reset dates
    setStartDate(null);
    setEndDate(null);

    // Reset returned dates
    setReturnedStartDate(new Date());
    setReturnedEndDate(new Date());

    // Reset search results flag
    setHasSearchResults(false);


    // Explicitly clear the rooms array first
    setRooms([]);

    // Reset rooms to initial state
    if (hotelId && !isLoading) {
      loadRoomsForAvailability(hotelId);
    }
    toast.info('Formulário limpo para cadastro de novo período');
  };

  // Convert Date objects to strings for the template component 

  return (
    <RoomAvailabilityManagementTemplate
      hotel={hotel}
      startDate={startDate}
      endDate={endDate}
      searchCurrency={searchCurrency}
      rooms={rooms}
      currencies={currencies}
      weekDays={weekDays}
      isLoading={isLoading}
      formErrors={formErrors}
      isSaveEnabled={isSaveEnabled}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onSearchCurrencyChange={handleSearchCurrencyChange}
      onQuantityChange={handleQuantityChange}
      onCurrencyChange={handleCurrencyChange}
      onPriceChange={handlePriceChange}
      onSave={handleSave}
      onCancel={handleCancel}
      onSearch={handleSearch}
      returnedStartDate={returnedStartDate}
      returnedEndDate={returnedEndDate}
      hasSearchResults={hasSearchResults}
      onNewPeriod={handleNewPeriod}
    />
  );
};

export default RoomAvailabilityManagement;
