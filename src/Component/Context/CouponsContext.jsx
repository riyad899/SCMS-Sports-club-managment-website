// 📁 src/context/CouponsContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { UseaxiousSecure } from '../hooks/UseaxiousSecure';

const CouponsContext = createContext();

export const CouponsProvider = ({ children }) => {
  const axiosSecure = UseaxiousSecure();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cardPage, setCardPage] = useState(1);
  const [tablePage, setTablePage] = useState(1);
  const cardPageSize = 6;
  const tablePageSize = 10;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosSecure.get('/coupons');
        setCoupons(res.data);
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [axiosSecure]);

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
        setCoupons,
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
