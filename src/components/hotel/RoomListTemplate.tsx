import React from 'react';
import { Button, Table } from 'react-bootstrap';
import RoomForm from './RoomForm';
import { RoomListTemplateProps } from '../../interfaces/DTO/Hotel/IHotelProps';

const RoomListTemplate: React.FC<RoomListTemplateProps> = ({
    rooms,
    loading,
    showForm,
    selectedRoom,
    hotelId,
    hotel,
    onAddRoom,
    onEditRoom,
    onDeleteRoom,
    onFormClose,
    getRoomTypeName,
    getRoomStatusBadge
}) => { 
    return (
        <div className="mt-3">
            <div className="d-flex justify-content-between mb-3">
                <h3>Quartos do Hotel - {hotel?.hotelName}</h3>
                <Button variant="primary" onClick={onAddRoom}>
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
                                    <th>Nome</th>
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
                                        <td>{room.name}</td>
                                        <td>{getRoomStatusBadge(room.status)}</td>
                                        <td>{room.minimumNights}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => onEditRoom(room)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => onDeleteRoom(room.id)}
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
                    onClose={onFormClose}
                />
            )}
        </div>
    );
};

export default RoomListTemplate;
