// 📁 src/context/CouponsContext.jsx
import { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UseaxiosPublic } from '../hooks/UseAxiosPublic';


const CouponsContext = createContext();

export const CouponsProvider = ({ children }) => {
 const axiosSecure = UseaxiosPublic();
  const [cardPage, setCardPage] = useState(1);
  const [tablePage, setTablePage] = useState(1);
  const cardPageSize = 6;
  const tablePageSize = 10;

  const { data: coupons = [], isLoading: loading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axiosSecure.get('/coupons');
      return res.data;
    },
  });

  const paginatedCardCoupons = coupons.slice(
    (cardPage - 1) * cardPageSize,
    cardPage * cardPageSize
  );

  const paginatedTableCoupons = coupons.slice(
    (tablePage - 1) * tablePageSize,
    tablePage * tablePageSize
  );

  return (
    <CouponsContext.Provider
      value={{
        coupons,
        loading,
        cardPage,
        setCardPage,
        tablePage,
        setTablePage,
        paginatedCardCoupons,
        paginatedTableCoupons,
      }}
    >
      {children}
    </CouponsContext.Provider>
  );
};

export const useCoupons = () => useContext(CouponsContext);
