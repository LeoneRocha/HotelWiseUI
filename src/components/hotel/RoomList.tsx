import React, { useEffect, useState } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { IRoom } from '../../interfaces/model/Hotel/IRoom';
import RoomService from '../../services/hotel/RoomService';  
import { RoomStatus } from '../../enums/hotel/RoomStatus';
import { RoomType } from '../../enums/hotel/RoomType';
import RoomForm from './RoomForm';

interface RoomListProps {
  hotelId: number;
}

const RoomList: React.FC<RoomListProps> = ({ hotelId }) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

  const loadRooms = async () => {
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
  };

  useEffect(() => {
    loadRooms();
  }, [hotelId]);

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
          loadRooms();
        }
      } catch (error) {
        console.error('Erro ao excluir quarto:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadRooms();
  };

  const getRoomTypeName = (type: RoomType): string => {
    switch (type) {
      case RoomType.Single: return 'Individual';
      case RoomType.Double: return 'Duplo';
      case RoomType.Suite: return 'Suíte'; 
      default: return 'Desconhecido';
    }
  };

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
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <h3>Quartos do Hotel</h3>
        <Button variant="primary" onClick={handleAddRoom}>
          Adicionar Quarto
        </Button>
      </div>

      {loading ? (
        <p>Carregando quartos...</p>
      ) : (
        <>
          {rooms.length === 0 ? (
            <p>Nenhum quarto cadastrado para este hotel.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Capacidade</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Mín. Noites</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{getRoomTypeName(room.roomType)}</td>
                    <td>{room.capacity}</td>
                    <td>{room.description}</td>
                    <td>{getRoomStatusBadge(room.status)}</td>
                    <td>{room.minimumNights}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditRoom(room)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      {showForm && (
        <RoomForm
          hotelId={hotelId}
          room={selectedRoom}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default RoomList;
