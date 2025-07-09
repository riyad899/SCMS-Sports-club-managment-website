import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { UseaxiousSecure } from '../../hooks/UseaxiousSecure';
import Loading from '../../Loading/Loading';



export const Announcements = () => {

    const axiosSecure = UseaxiousSecure();

  const { data: announcements = [], isLoading, isError } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await axiosSecure.get('/announcements');
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load announcements.
      </div>
    );

  if (!announcements.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No announcements found.
      </div>
    );
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Club Announcements</h2>
      <ul className="space-y-4">
        {announcements.map((announcement) => (
          <li key={announcement._id} className="border-b pb-3 last:border-none">
            <h3 className="font-semibold text-lg text-blue-700">
              {announcement.title || 'Announcement'}
            </h3>
            <p className="text-gray-700">{announcement.message || announcement.description}</p>
            {announcement.date && (
              <p className="text-sm text-gray-500 mt-1">
                {new Date(announcement.date).toLocaleDateString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
