import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import HotelForm from './HotelForm'
import RoomList from './RoomList'
import { HotelTabsProps } from '../../interfaces/DTO/Hotel/IHotelProps'
import RoomAvailabilityManagement from './RoomAvailabilityManagement'

const handleSave = () => {
  // Lógica para lidar com a ação de salvar, se necessário
};
const HotelTabs: React.FC<HotelTabsProps> = ({ hotelId, hotel }) => {
  const [key, setKey] = useState<string>('details');

  return (
    <div className="container-fluid mt-5">
      <Tabs
        id="hotel-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k ?? 'details')}
        className="mb-3"
      >
        <Tab eventKey="details" title="Detalhes do Hotel">
          <HotelForm hotelId={hotelId ?? 0} onSave={handleSave} />
        </Tab>
        {hotelId && (
          <Tab eventKey="rooms" title="Quartos">
            <RoomList hotelId={hotelId} hotel={hotel} />
          </Tab>
        )}

        {hotelId && (
          <Tab eventKey="availability" title="Disponibilidade">
            <RoomAvailabilityManagement hotelId={hotelId} hotel={hotel} />
          </Tab>
        )}
      </Tabs>
    </div>
  )
}

export default HotelTabs