
import React from 'react';

interface SimpleButtonProps {
    label: string;
    onClick: () => void;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({ label, onClick }) => (
    <button onClick={onClick}>{label}</button>
);