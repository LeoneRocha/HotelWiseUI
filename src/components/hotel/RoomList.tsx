import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { IRoom } from '../../interfaces/model/Hotel/IRoom';
import RoomService from '../../services/hotel/RoomService';
import { RoomStatus } from '../../enums/hotel/RoomStatus';
import { RoomType } from '../../enums/hotel/RoomType';
import { RoomListProps } from '../../interfaces/DTO/Hotel/IHotelProps';
import RoomListTemplate from './RoomListTemplate';
import { getEnumLabel } from '../../enums/extensions/enumHelper';

const RoomList: React.FC<RoomListProps> = ({ hotelId, hotel }) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

  const loadedOnce = useRef(false);

  const loadRoomsList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await RoomService.getRoomsByHotelId(hotelId);
      if (response.success) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
    } finally {
      setLoading(false);
    }
  }, [hotelId]);


  useEffect(() => {
    if (!loadedOnce.current) {
      loadRoomsList();
      loadedOnce.current = true;
    }
 }, [hotelId, loadRoomsList]);

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setShowForm(true);
  };

  const handleEditRoom = (room: IRoom) => {
    setSelectedRoom(room);
    setShowForm(true);
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este quarto?')) {
      try {
        const response = await RoomService.delete(roomId);
        if (response.success) {
          await loadRoomsList();
        }
      } catch (error) {
        console.error('Erro ao excluir quarto:', error);
      }
    }
  };

  const handleFormClose = async () => {
    setShowForm(false);
    await loadRoomsList();
  };

  function getRoomTypeName(roomType: number): string {
    return getEnumLabel(RoomType, roomType);
  }

  const getRoomStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.Available:
        return <Badge bg="success">Disponível</Badge>;
      case RoomStatus.Occupied:
        return <Badge bg="danger">Ocupado</Badge>;
      case RoomStatus.Maintenance:
        return <Badge bg="warning">Manutenção</Badge>;
      case RoomStatus.Cleaning:
        return <Badge bg="info">Limpeza</Badge>;
      default:
        return <Badge bg="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <RoomListTemplate
      hotel={hotel}
      rooms={rooms}
      loading={loading}
      showForm={showForm}
      selectedRoom={selectedRoom}
      hotelId={hotelId}
      onAddRoom={handleAddRoom}
      onEditRoom={handleEditRoom}
      onDeleteRoom={handleDeleteRoom}
      onFormClose={handleFormClose}
      getRoomTypeName={getRoomTypeName}
      getRoomStatusBadge={getRoomStatusBadge}
    />
  );
};

export default RoomList;
