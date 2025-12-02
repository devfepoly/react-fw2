import { useContext } from 'react';
import { CompareContext } from '../context/CompareContext';

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) throw new Error('useCompare must be used within CompareProvider');
    return context;
};
