import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const ViewMoreLink = ({ context, total }) => {
  const buildQueryString = () => {
    const params = new URLSearchParams();
    for (const key in context) {
      const value = context[key];
      if (Array.isArray(value) && value.length > 0) {
        const paramKey = key === 'category' ? 'type' : key;
        value.forEach(v => params.append(paramKey, v));
      } else if (value) {
        const paramKey = key === 'category' ? 'type' : key;
        params.set(paramKey, value);
      }
    }
    return params.toString();
  };

  const queryString = buildQueryString();
  const remainingCount = total - 5;

  return (
    <div className="flex justify-center my-2">
      <Link
        to={`/browse?${queryString}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-6 py-2 font-semibold text-white bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        {`View ${remainingCount} More Properties`}
        <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default ViewMoreLink;